import { spotify } from "@/lib/auth";
import { generateState } from "arctic";
import { cookies } from "next/headers";

export async function GET(): Promise<Response> {
  const state = generateState();

  const url = await spotify.createAuthorizationURL(state, {
    scopes: [
      "user-top-read",
      "user-read-recently-played",
      "user-read-private",
      "user-read-email",
      "playlist-modify-public",
      "playlist-modify-private",
      "user-modify-playback-state",
    ],
  });

  cookies().set("spotify_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return Response.redirect(url);
}
