import { cookies } from "next/headers";
import { getToken } from "./getToken";

// fetch all spotify data needed
export async function getData() {
  let accessToken = cookies().get("spotify_access_token")?.value;

  if (!accessToken) {
    accessToken = (await getToken()).access_token;
  }

  try {
    // get access token
    const timeframes = ["short_term", "medium_term", "long_term"];
    const limit = "50";

    // fetch the top tracks and artists
    const fetchData = async (timeframe: string) => {
      const tracksResponse = await fetch(
        `https://api.spotify.com/v1/me/top/tracks?time_range=${timeframe}&limit=${limit}`,
        {
          next: { revalidate: 24 * 60 * 60 },
          method: "get",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const artistsResponse = await fetch(
        `https://api.spotify.com/v1/me/top/artists?time_range=${timeframe}&limit=${limit}`,
        {
          next: { revalidate: 24 * 60 * 60 },
          method: "get",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const tracks = await tracksResponse.json();
      const artists = await artistsResponse.json();

      return { tracks, artists };
    };

    const allData = await Promise.all(timeframes.map(fetchData));
    const data = allData.reduce(
      (acc, data, index) => {
        acc[timeframes[index]] = data;
        return acc;
      },
      {} as Record<string, { tracks: any; artists: any }>,
    );

    return { data: data, error: null };
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    else {
      return { error: "An error occurred" };
    }
  }
}
