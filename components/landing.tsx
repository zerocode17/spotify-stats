import Link from "next/link";
import { Button } from "./ui/button";

export default function Landing() {
  return (
    <div className="my-16 flex w-full flex-col items-center space-y-12 text-wrap text-center">
      <div>
        <h1 className="text-7xl font-bold duration-500 ease-in animate-in fade-in">
          Spotify Stats
        </h1>
        <div className="p-6 duration-500 ease-in animate-in fade-in">
          <p>Discover your most listened songs, artists</p>
          <p>and generate new playlists based on smart recommendations</p>
        </div>
      </div>
      <Link href={"/login/spotify"}>
        <Button className="rounded-3xl px-16 py-7 text-center text-3xl font-bold duration-500 ease-in animate-in fade-in">
          Connect with Spotify
        </Button>
      </Link>
    </div>
  );
}
