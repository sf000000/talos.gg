// import RecentRepacks from "./components/recent-repacks";
import GameLibrary from "./components/game-library";
import TrendingGames from "./components/trending-games";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <TrendingGames />
      {/* <RecentRepacks /> */}
      <GameLibrary />
    </div>
  );
}
