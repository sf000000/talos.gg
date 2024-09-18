"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { GameDetail } from "@/common/types";
import GameCard from "./game-card";

const TrendingGames = () => {
  const [games, setGames] = useState<GameDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/discover")
      .then((response) => response.json())
      .then((data) => {
        setGames(data);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div>
        <h2 className="text-xl font-semibold">Popular Games</h2>
        <p className="text-sm text-muted-foreground font-medium">
          What everyone is playing right now
        </p>
      </div>
      <Carousel className="w-full">
        <CarouselContent className="-ml-4">
          {loading ? (
            <>
              <GameCardSkeleton />
            </>
          ) : (
            games.map((game) => (
              <CarouselItem
                key={game.id}
                className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
              >
                <GameCard game={game} />
              </CarouselItem>
            ))
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

const GameCardSkeleton = () => {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <CarouselItem
          key={i}
          className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 py-5"
        >
          <div className="border border-primary/20 shadow rounded overflow-hidden">
            <div className="relative w-full h-0 pb-[150%] bg-black/30 animate-pulse"></div>
          </div>
        </CarouselItem>
      ))}
    </>
  );
};

export default TrendingGames;
