"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Play, Sparkles } from "lucide-react";
import { useState, useTransition } from "react";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useToast } from "./ui/use-toast";
import { addToPlaylist, createPlaylist } from "@/lib/actions";

export default function GeneratorCard({
  tracks,
  artists,
}: {
  tracks: any;
  artists: any;
}) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const seeds = {
    tracks: tracks?.items.map((track: any) => track.id),
    artists: artists?.items.map((artist: any) => artist.id),
  };

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

  async function handleClick() {
    startTransition(async () => {
      const res = await fetch("/api/spotify/recommend", {
        method: "POST",
        body: JSON.stringify(seeds),
      });
      if (!res.ok) {
        setError(res.statusText);
      }
      const data = await res.json();
      setData(data);
    });
  }

  async function handleSaveToPlaylist() {
    const id = await createPlaylist();
    const uris = data.tracks.map((track: any) => track.uri);
    const res = await addToPlaylist(id, uris);
    if (res.error) {
      toast({
        duration: 3000,
        className: "p-4",
        variant: "destructive",
        title: "Error",
        description: res.error,
      });
    }
    if (res.success) {
      toast({
        duration: 3000,
        className: "p-4",
        variant: "success",
        title: "Success",
        description: "Tracks saved",
      });
    }
  }

  if (error) {
    toast({
      duration: 3000,
      className: "p-4",
      variant: "destructive",
      title: "Error",
      description: error,
    });
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center justify-between space-x-10">
          Get recommendations{" "}
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger className="hidden lg:block">
                <Info className="size-5 text-zinc-600" />
              </TooltipTrigger>
              <TooltipContent className="flex flex-col p-2">
                <span className="text-xs tracking-wide">
                  Recommendations are based on your top
                </span>
                <span className="text-xs tracking-wide">
                  songs and artist for the selected time frame
                </span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          disabled={isPending}
          className="w-full rounded-2xl text-lg font-bold"
          onClick={handleClick}
        >
          Generate
          <Sparkles className="size-7 pl-2" />
        </Button>
        <ul className="space-y-4 pt-7">
          {data &&
            data.tracks.map((track: any) => (
              <div
                key={track.id}
                className="group relative flex items-center justify-between rounded-md hover:bg-muted"
              >
                <li className="flex items-center space-x-2">
                  <Image
                    className="h-16 w-16 rounded-md"
                    src={track.album.images[2].url}
                    alt={`${track.name} Cover Image`}
                    width={track.album.images[2].width}
                    height={track.album.images[2].height}
                  />
                  <div className="relative flex w-full flex-col">
                    <span>{track.name}</span>
                    <span className="text-muted-foreground">
                      {track.artists
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
                        onClick={() => handlePlay(track.uri)}
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
            ))}
        </ul>
        {data && data.tracks.length !== 0 && (
          <Button
            onClick={handleSaveToPlaylist}
            className="mt-6 w-full rounded-2xl text-lg font-bold"
          >
            Save to playlist
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
