import Image from "next/image";
import { GameDetail } from "@/common/types";
import Link from "next/link";

const GameCard = ({ game }: { game: GameDetail }) => {
  return (
    <Link href={`/games/${game.id}`} className="p-[10px] select-none">
      <div className="border border-black/40 dark:border-primary/10 shadow rounded-md overflow-hidden group">
        <div className="relative w-full h-0 pb-[150%]">
          <Image
            src={game.cover?.url || "/placeholder.png"}
            alt={game.name}
            className="object-center"
            layout="fill"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
            <h3 className="text-white text-xl font-bold text-center px-2">
              {game.name}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
