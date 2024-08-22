"use server";

import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { validateRequest, lucia } from "./auth";
import { getToken } from "./spotify/getToken";

interface ActionResult {
  error: string | null;
}

// lucia log out, invalidates session
export async function logout(): Promise<ActionResult> {
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/");
}

// for client-side navigation
export async function navigate(path: string, type?: RedirectType) {
  redirect(path, type);
}

// Create playlist in Spotify, returns playlist ID
export async function createPlaylist() {
  let accessToken = cookies().get("spotify_access_token")?.value;

  if (!accessToken) {
    accessToken = (await getToken()).access_token;
  }
  const { user } = await validateRequest();

  if (!user) {
    return {
      error: "Unauthorized",
    };
  }

  const res = await fetch(
    `https://api.spotify.com/v1/users/${user.spotifyId}/playlists`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        name: "Recommendations by Spotify Stats",
      }),
    },
  );

  const { id } = await res.json();

  return id;
}

export async function addToPlaylist(id: string, uris: string[]) {
  let accessToken = cookies().get("spotify_access_token")?.value;

  if (!accessToken) {
    accessToken = (await getToken()).access_token;
  }

  const res = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      uris,
    }),
  });

  if (!res.ok) {
    return {
      error: "Error adding tracks to playlist",
    };
  }

  return { success: "Tracks added to playlist" };
}
