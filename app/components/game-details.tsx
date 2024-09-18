"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Gamepad2, Loader2, Monitor, Star } from "lucide-react";

import { useEffect, useState } from "react";
import { GameDetail } from "@/common/types";
import moment from "moment";
import Image from "next/image";
import DownloadSources from "./download-sources";

interface GameDetailsProps {
  id: string;
}

const GameDetails = ({ id }: GameDetailsProps) => {
  const [game, setGame] = useState<GameDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/games?gameId=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setGame(data);
        console.log(data);
        setLoading(false);
      });
  }, [id]);

  return (
    <>
      {loading ? (
        <p className="flex items-center justify-center">
          <Loader2 size={32} className="animate-spin" />
        </p>
      ) : (
        <div>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Image
                src={game?.cover?.url || "/images/placeholder.png"}
                alt="Elden Ring Cover"
                className="rounded-lg shadow-lg w-full h-full object-cover"
                width={600}
                height={400}
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{game?.name}</h1>
              <div className="flex items-center mb-4">
                <Star className="w-5 h-5 fill-yellow-500 text-yellow-500 mr-1" />
                <span className="font-semibold">
                  {Math.round(game?.aggregated_rating || 0)}%
                </span>
                <span className="text-sm text-muted-foreground ml-2">
                  (Aggregated Rating)
                </span>
              </div>
              <p className="text-lg mb-4">
                {game?.summary || "No description available."}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>
                    {game?.first_release_date
                      ? moment
                          .unix(game.first_release_date)
                          .format("MMMM D, YYYY")
                      : "Unknown"}
                  </span>
                </div>
                {/* <div className="flex items-center"> */}
                {/* <Monitor className="w-5 h-5 mr-2" /> */}
                {/* <span>
                    {game?.platforms
                      ?.map((platform) => platform.name)
                      .join(", ")}
                  </span> */}
                {/* </div> */}
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {game?.genres?.map((genre) => (
                  <Badge key={genre}>{genre}</Badge>
                ))}
              </div>
              {game && <DownloadSources game={game} />}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameDetails;
