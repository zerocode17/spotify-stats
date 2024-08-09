"use client";

import TracksCard from "./tracks-card";
import ArtistsCard from "./artists-card";
import GeneratorCard from "./generator-card";

export default function MainCards({
  timeframe,
  allData,
}: {
  timeframe: string;
  allData: Record<string, { tracks: any; artists: any }>;
}) {
  const timeRange =
    timeframe === "1 month"
      ? "short_term"
      : timeframe === "6 months"
        ? "medium_term"
        : timeframe === "1 year"
          ? "long_term"
          : "medium_term";
  const { tracks, artists } = allData[timeRange];

  return (
    <main className="mx-auto mb-20 flex max-w-[1400px] justify-center space-x-10">
      <div className="basis-1/3">
        <TracksCard timeframe={timeframe} tracks={tracks} />
      </div>
      <div className="basis-1/3">
        <GeneratorCard tracks={tracks} artists={artists} />
      </div>
      <div className="basis-1/3">
        <ArtistsCard timeframe={timeframe} artists={artists} />
      </div>
    </main>
  );
}
