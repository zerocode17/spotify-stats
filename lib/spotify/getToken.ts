import { cookies } from "next/headers";

interface Token {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
}

export async function getToken() {
  const refreshToken = cookies().get("spotify_refresh_token")?.value;

  if (!refreshToken) {
    throw new Error("No refresh token found, please log in again");
  }

  const payload = {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`)}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  };

  const tokensRes = await fetch(
    "https://accounts.spotify.com/api/token",
    payload,
  );

  const token: Token = await tokensRes.json();

  return token;
}
