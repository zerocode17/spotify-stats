import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia, Session, TimeSpan, User } from "lucia";
import { db } from "./db/db";
import { sessionTable, userTable } from "./db/schema";
import { Spotify } from "arctic";
import { cache } from "react";
import { cookies } from "next/headers";

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: true,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  sessionExpiresIn: new TimeSpan(4, "h"),
  getUserAttributes(attributes) {
    return {
      spotifyId: attributes.spotify_id,
      username: attributes.display_name,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  spotify_id: number;
  display_name: string;
}

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch {}
    return result;
  },
);

export const spotify = new Spotify(
  process.env.SPOTIFY_CLIENT_ID!,
  process.env.SPOTIFY_CLIENT_SECRET!,
  "http://localhost:3000/login/spotify/callback",
);
