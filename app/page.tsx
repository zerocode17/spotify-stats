import Landing from "@/components/landing";
import MainCards from "@/components/main-cards";
import TimeframeSelector from "@/components/timeframe-selector";
import { validateRequest } from "@/lib/auth";
import { getData } from "@/lib/spotify/getData";

export default async function Home({
  searchParams,
}: {
  searchParams: { timeframe: string | null; limit: string | null };
}) {
  const { user } = await validateRequest();

  const timeframe = searchParams.timeframe || "6 months";

  let allData;
  if (user) {
    allData = await getData();
  }

  if (allData?.error) {
    return <div>{allData.error}</div>;
  }

  if (!allData?.data) {
    return null;
  }

  return (
    <>
      {user ? (
        <main>
          <TimeframeSelector />
          <MainCards allData={allData.data} timeframe={timeframe} />
        </main>
      ) : (
        <Landing />
      )}
    </>
  );
}
