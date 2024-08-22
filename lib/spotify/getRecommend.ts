import { cookies } from "next/headers";
import { getToken } from "./getToken";

function getRandomElements<T>(array: T[], n: number): T[] {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

export async function getRecommend(seeds: {
  tracks: string[];
  artists: string[];
}) {
  let accessToken = cookies().get("spotify_access_token")?.value;

  if (!accessToken) {
    accessToken = (await getToken()).access_token;
  }

  try {
    const tracks = getRandomElements(seeds.tracks, 3);
    const artists = getRandomElements(seeds.artists, 2);

    const params = new URLSearchParams({
      limit: "25",
      seed_tracks: tracks.join(","),
      seed_artists: artists.join(","),
    });

    const res = await fetch(
      `https://api.spotify.com/v1/recommendations?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const response = await res.json();

    return response;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error;
  }
}
