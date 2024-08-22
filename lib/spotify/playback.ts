import { getToken } from "@/lib/spotify/getToken";
import { cookies } from "next/headers";

export async function playback(uri: string[]) {
  let accessToken = cookies().get("spotify_access_token")?.value;

  if (!accessToken) {
    accessToken = (await getToken()).access_token;
  }

  try {
    const res = await fetch("https://api.spotify.com/v1/me/player/play", {
      method: "PUT",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        uris: uri,
      }),
    });

    const response = await res.json();

    return response;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    } else {
      return error;
    }
  }
}
