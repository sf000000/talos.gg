import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Genre } from "@/lib/utils";

interface GameLibrarySidebarProps {
  genres: Genre[];
  selectedGenre: Genre | null | undefined;
  setSelectedGenre: (genre: Genre) => void;
}

const GameLibrarySidebar: React.FC<GameLibrarySidebarProps> = ({
  genres,
  selectedGenre,
  setSelectedGenre,
}) => {
  return (
    <aside className="w-64 border-r border-border">
      <ScrollArea className="h-full">
        <div className="p-4">
          <div className="space-y-2">
            {genres.map((genre) => (
              <Button
                key={genre.id}
                variant={selectedGenre?.id === genre.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedGenre(genre)}
              >
                {genre.name}
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
};

export default GameLibrarySidebar;
