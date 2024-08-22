import Footer from "@/components/footer";
import Landing from "@/components/landing";
import MainCards from "@/components/main-cards";
import TimeframeSelector from "@/components/timeframe-selector";
import { validateRequest } from "@/lib/auth";
import { getData } from "@/lib/spotify/getData";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

export default async function Home({
  searchParams,
}: {
  searchParams: { timeframe: string | null; limit: string | null };
}) {
  const { user } = await validateRequest();

  const timeframe = searchParams.timeframe || "6 months";

  let allData;
  if (user?.spotifyId) {
    allData = await getData();
    if (allData.error) {
      console.log("Error: " + allData.error);
    }
  }

  const data = allData?.data;
  return (
    <>
      {user ? (
        <div className="flex h-svh flex-col justify-between">
          <main>
            <TimeframeSelector />
            <MainCards allData={data} timeframe={timeframe} />
          </main>
          <footer>
            <Footer />
          </footer>
        </div>
      ) : (
        <Landing />
      )}
    </>
  );
}
