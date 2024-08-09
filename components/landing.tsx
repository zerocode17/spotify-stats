import Link from "next/link";
import { Button } from "./ui/button";

export default function Landing() {
  return (
    <div className="my-16 flex flex-col items-center space-y-12 text-wrap px-4 text-center lg:px-0">
      <div>
        <h1 className="text-7xl font-bold duration-500 ease-in animate-in fade-in">
          Spotify Stats
        </h1>
        <div className="p-6 duration-500 ease-in animate-in fade-in">
          <p>Discover your most listened songs, artists</p>
          <p>and generate new playlists based on smart recommendations</p>
        </div>
      </div>
      <Button
        className="w-full max-w-[524px] rounded-3xl px-16 py-7 text-center text-3xl font-bold duration-500 ease-in animate-in fade-in"
        asChild
      >
        <Link href={"/login/spotify"}>Connect with Spotify</Link>
      </Button>
    </div>
  );
}
