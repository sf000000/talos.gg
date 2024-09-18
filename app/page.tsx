// import RecentRepacks from "./components/recent-repacks";
import TrendingGames from "./components/trending-games";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <TrendingGames />
      {/* <RecentRepacks /> */}
    </div>
  );
}
