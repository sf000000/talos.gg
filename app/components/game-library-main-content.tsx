import { GameDetail } from "@/common/types";
import { Genre } from "@/lib/utils";
import GameCard from "./game-card";

interface GameLibraryMainContentProps {
  selectedGenre: Genre | undefined;
  games: GameDetail[];
  loading: boolean;
}

const GameLibraryMainContent: React.FC<GameLibraryMainContentProps> = ({
  games,
  loading,
}) => {
  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          <>
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-black/30 border border-black/20 dark:border-primary/10 animate-pulse h-96 rounded-lg"
              ></div>
            ))}
          </>
        ) : (
          games.map((game) => <GameCard key={game.id} game={game} />)
        )}
      </div>
    </main>
  );
};

export default GameLibraryMainContent;
