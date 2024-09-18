import { GameDetail } from "@/common/types";
import { Genre } from "@/lib/utils";
import GameCard from "./game-card";

interface GameLibraryMainContentProps {
  selectedGenre: Genre | undefined;
  games: GameDetail[];
}

const GameLibraryMainContent: React.FC<GameLibraryMainContentProps> = ({
  games,
}) => {
  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </main>
  );
};

export default GameLibraryMainContent;
