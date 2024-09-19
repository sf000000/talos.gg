import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Genre } from "@/lib/utils";

interface GameLibrarySidebarProps {
  genres: Genre[];
  selectedGenre: Genre | null | undefined;
  setSelectedGenre: (genre: Genre) => void;
  loading: boolean;
}

const GameLibrarySidebar: React.FC<GameLibrarySidebarProps> = ({
  genres,
  selectedGenre,
  setSelectedGenre,
  loading,
}) => {
  return (
    <aside className="w-64 border-r border-black/20 dark:border-primary/10">
      <ScrollArea className="h-full">
        <div className="p-4">
          <div className="space-y-2">
            {loading ? (
              <>
                {Array.from({ length: 16 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-black/30 border border-black/20 dark:border-primary/10 animate-pulse h-10 rounded-lg"
                  ></div>
                ))}
              </>
            ) : (
              genres.map((genre) => (
                <Button
                  key={genre.id}
                  variant={selectedGenre?.id === genre.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedGenre(genre)}
                >
                  {genre.name}
                </Button>
              ))
            )}
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
};

export default GameLibrarySidebar;
