import { cookies } from "next/headers";
import { getToken } from "./getToken";

// fetch all spotify data needed
export async function getData() {
  const refreshToken = cookies().get("spotify_refresh_token")?.value;

  if (!refreshToken) {
    return {
      short_term: { tracks: {}, artists: {} },
      medium_term: { tracks: {}, artists: {} },
      long_term: { tracks: {}, artists: {} },
    };
  }

  // get access token
  const { access_token: accessToken } = await getToken();

  const timeframes = ["short_term", "medium_term", "long_term"];
  const limit = "50";

  // fetch the top tracks and artists
  const fetchData = async (timeframe: string) => {
    const tracksResponse = await fetch(
      `https://api.spotify.com/v1/me/top/tracks?time_range=${timeframe}&limit=${limit}`,
      {
        method: "get",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const artistsResponse = await fetch(
      `https://api.spotify.com/v1/me/top/artists?time_range=${timeframe}&limit=${limit}`,
      {
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

  return allData.reduce(
    (acc, data, index) => {
      acc[timeframes[index]] = data;
      return acc;
    },
    {} as Record<string, { tracks: any; artists: any }>,
  );
}
