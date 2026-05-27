import { getTopCoins } from "./lib/api";
import StatsBar from "./components/StatsBar";
import TabView from "./components/TabView";
import Navbar from "./components/Navbar";

export default async function Home() {
  const coins = await getTopCoins();

  return (
    <>
      <Navbar />
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-green-400">Crypto Tracker</h1>
        <p className="text-gray-400 mt-2">Live prices for the top 10 coins</p>
        <StatsBar coins={coins} />
        <TabView coins={coins} />
      </div>
    </main>
    </>
  );
}
