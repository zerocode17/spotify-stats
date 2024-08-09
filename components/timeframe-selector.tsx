"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export default function TimeframeSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [timeframe, setTimeframe] = useState("6 months");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const existingTimeframe = searchParams.get("timeframe");

    if (existingTimeframe) {
      setTimeframe(existingTimeframe);
    } else {
      setTimeframe("6 months");
    }
  }, [searchParams]);

  function handleTimeSelect(timeframe: string) {
    startTransition(() => {
      setTimeframe(timeframe);
      const updatedSearchParams = new URLSearchParams(searchParams);
      updatedSearchParams.set("timeframe", timeframe);
      router.replace(`${pathname}?${updatedSearchParams}`);
    });
  }

  return (
    <div className="mb-6 mt-4 flex items-center justify-center">
      <div
        className={`relative flex rounded-lg border bg-card px-1 ${isPending ? "cursor-not-allowed opacity-60" : ""}`}
      >
        <div
          onClick={() => handleTimeSelect("1 month")}
          className={`z-20 p-3 py-4 ${isPending ? "cursor-not-allowed" : "hover:cursor-pointer"}`}
        >
          <span>1 month</span>
        </div>
        <div
          onClick={() => handleTimeSelect("6 months")}
          className={`z-20 p-3 py-4 pl-10 ${isPending ? "cursor-not-allowed" : "hover:cursor-pointer"}`}
        >
          <span>6 months</span>
        </div>
        <div
          onClick={() => handleTimeSelect("1 year")}
          className={`z-20 p-3 py-4 pl-10 ${isPending ? "cursor-not-allowed" : "hover:cursor-pointer"}`}
        >
          <span className="">1 year</span>
        </div>
        <div
          className={`absolute bottom-2 h-10 rounded-lg border bg-background ${timeframe === "1 month" ? "left-2 w-[72px]" : timeframe === "6 months" ? "w-[82px] translate-x-[116px]" : timeframe === "1 year" ? "w-14 translate-x-[236px]" : ""} transition-all duration-200`}
        ></div>
      </div>
    </div>
  );
}
