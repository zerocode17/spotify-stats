"use client";

import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";
import { Play } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import Image from "next/image";
import { useToast } from "./ui/use-toast";
import { INSPECT_MAX_BYTES } from "buffer";

export default function TracksCard({
  timeframe,
  tracks,
}: {
  timeframe: string;
  tracks: any;
}) {
  const trackIndexStart = 0;
  const [trackIndexEnd, setTrackIndexEnd] = useState(25);
  const [trackLoad, setTrackLoad] = useState(true);

  const { toast } = useToast();

  if (!tracks.items) {
    return null;
  }

  async function handlePlay(uri: string) {
    const uris = [];
    uris.push(uri);
    try {
      const res = await fetch("/api/spotify/playback", {
        method: "PUT",
        body: JSON.stringify({
          uri: uris,
        }),
      });

      const response = await res.json();
      if (response.error) {
        if (response.error.reason === "NO_ACTIVE_DEVICE") {
          toast({
            duration: 3000,
            className: "p-4",
            variant: "destructive",
            title: "Error playing track",
            description:
              "No active device found, try playing a song on your device",
          });
        }
      }
    } catch (error) {
      console.log("Error: " + error);
    }
  }

  return (
    <Card className="h-fit w-full max-w-[450px]">
      <CardHeader>
        <CardTitle>
          Top tracks for the past{" "}
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
          {tracks.items
            ? tracks.items
                .slice(trackIndexStart, trackIndexEnd)
                .map((item: any, index: number) => (
                  <div
                    key={index}
                    className="group relative flex items-center justify-between rounded-md hover:bg-muted"
                  >
                    <li className="flex items-center space-x-2">
                      <Image
                        className="h-16 w-16 rounded-md"
                        src={item.album.images[2].url}
                        alt={`${item.name} Cover Image`}
                        width={item.album.images[2].width}
                        height={item.album.images[2].height}
                      />
                      <div className="relative flex w-full flex-col">
                        <span>{`${index + 1}. ${item.name}`}</span>
                        <span className="text-muted-foreground">
                          {item.artists
                            .map((artist: any) => artist.name)
                            .join(", ")}
                        </span>
                      </div>
                    </li>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className="absolute right-2 z-30 hidden items-center justify-center rounded-full duration-200 animate-in fade-in group-hover:flex"
                            size={"icon"}
                            onClick={() => handlePlay(item.uri)}
                          >
                            <Play className="h-5 w-5" fill="black" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="hidden px-1 py-1 text-xs lg:block">
                          Play on Spotify
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ))
            : null}
        </ul>
        {trackIndexEnd < tracks.items.length && (
          <Button
            variant={"outline"}
            className={`mt-8 h-7 w-full rounded-xl ${!trackLoad ? "hidden" : "inline-flex"}`}
            onClick={() => {
              if (trackIndexEnd + 10 >= tracks.items.length) {
                setTrackLoad(false);
              }
              setTrackIndexEnd(trackIndexEnd + 10);
            }}
          >
            Load more
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
