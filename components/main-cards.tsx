"use client";

import TracksCard from "./tracks-card";
import ArtistsCard from "./artists-card";
import GeneratorCard from "./generator-card";

export default function MainCards({
  timeframe,
  allData,
}: {
  timeframe: string;
  allData?: Record<string, { tracks: any; artists: any }>;
}) {
  const timeRange =
    timeframe === "1 month"
      ? "short_term"
      : timeframe === "6 months"
        ? "medium_term"
        : timeframe === "1 year"
          ? "long_term"
          : "medium_term";
  const data = allData?.[timeRange] ?? null;

  return (
    <main className="mx-auto mb-20 flex max-w-[1400px] flex-col justify-center px-4 lg:flex-row lg:space-x-10 lg:px-0">
      <div className="order-2 mb-6 basis-1/3 lg:order-none">
        <TracksCard timeframe={timeframe} tracks={data?.tracks} />
      </div>
      <div className="order-1 mb-6 basis-1/3 lg:order-none">
        <GeneratorCard tracks={data?.tracks} artists={data?.artists} />
      </div>
      <div className="order-3 basis-1/3 lg:order-none">
        <ArtistsCard timeframe={timeframe} artists={data?.artists} />
      </div>
    </main>
  );
}
