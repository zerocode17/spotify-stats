import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import Image from "next/image";

export default function ArtistsCard({
  timeframe,
  artists,
}: {
  timeframe: string;
  artists: any;
}) {
  const artistIndexStart = 0;
  const [artistIndexEnd, setArtistIndexEnd] = useState(25);

  const [artistLoad, setArtistLoad] = useState(true);

  return (
    <Card className="h-fit w-full max-w-[450px]">
      <CardHeader>
        <CardTitle>
          Top artists for the past{" "}
          {timeframe === "1 month"
            ? "month"
            : timeframe === "6 months"
              ? "6 months"
              : timeframe === "1 year"
                ? "year"
                : ""}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {artists.items.length > 0
            ? artists.items
                .slice(artistIndexStart, artistIndexEnd)
                .map((item: any, index: number) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Image
                      className="h-16 w-16 rounded-md"
                      src={item.images[2].url}
                      alt={`${item.name} Cover Image`}
                      width={64}
                      height={64}
                    />
                    <h1 className="text-lg">
                      {`${index + 1}. `}
                      {item.name}
                    </h1>
                  </li>
                ))
            : null}
        </ul>
        {artistIndexEnd < artists.items.length && (
          <Button
            variant={"outline"}
            className={`mt-8 h-7 w-full rounded-xl ${!artistLoad ? "hidden" : "inline-flex"}`}
            onClick={() => {
              if (artistIndexEnd + 10 >= artists.items.length) {
                setArtistLoad(false);
              }
              setArtistIndexEnd(artistIndexEnd + 10);
            }}
          >
            Load more
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
