import { playback } from "@/lib/spotify/playback";

export async function PUT(req: Request) {
  const { uri } = await req.json();

  const res = (await playback(uri)) as Response;

  return new Response(JSON.stringify(res), {
    status: res.status,
    statusText: res.statusText,
  });
}
