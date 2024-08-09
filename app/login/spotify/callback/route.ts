import { lucia, spotify } from "@/lib/auth";
import { db } from "@/lib/db/db";
import { userTable } from "@/lib/db/schema";
import { OAuth2RequestError } from "arctic";
import { eq } from "drizzle-orm";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("spotify_oauth_state")?.value ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await spotify.validateAuthorizationCode(code);
    const spotifyUserReponse = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const spotifyUser: SpotifyUser = await spotifyUserReponse.json();
    const existingUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.spotify_id, spotifyUser.id));

    if (existingUser.length > 0) {
      const session = await lucia.createSession(existingUser[0].id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      cookies().set("spotify_refresh_token", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    const userId = generateIdFromEntropySize(10);

    await db.insert(userTable).values({
      id: userId,
      spotify_id: spotifyUser.id,
      email: spotifyUser.email,
      display_name: spotifyUser.display_name,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = await lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (e) {
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}

interface SpotifyUser {
  id: string;
  display_name: string | null;
  email: string;
  images: {
    url: string;
    height: number | null;
    width: number | null;
  }[];
}
