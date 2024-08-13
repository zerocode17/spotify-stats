import Link from "next/link";

export default function Footer() {
  return (
    <div className="flex w-full items-center justify-center border-t px-6 py-4 text-sm text-muted-foreground">
      <div className="flex w-full max-w-[800px] items-center justify-between">
        <Link href="https://developer.spotify.com/">Spotify API</Link>
        <Link href="https://github.com/zerocode17/spotify-stats">Github</Link>
        <Link href="https://github.com/zerocode17/spotify-stats/issues">
          Report an issue
        </Link>
      </div>
    </div>
  );
}
