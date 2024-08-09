import { getToken } from "@/lib/spotify/getToken";

export async function playback(uri: string[]) {
  const token = await getToken();

  try {
    const res = await fetch("https://api.spotify.com/v1/me/player/play", {
      method: "PUT",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token.access_token}`,
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
