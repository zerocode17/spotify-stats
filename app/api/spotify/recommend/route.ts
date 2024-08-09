import { getRecommend } from "@/lib/spotify/getRecommend";

export async function POST(req: Request) {
  const seeds = await req.json();
  if (!seeds) {
    return new Response(null, {
      status: 400,
      statusText: "Bad Request",
    });
  }

  const response = await getRecommend(seeds);

  return new Response(JSON.stringify(response));
}
