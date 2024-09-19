"use client";

import { useState, useEffect } from "react";
import { fetchGamesByGenre, fetchGenres, Genre } from "@/lib/utils";
import { GameDetail } from "@/common/types";
import GameLibrarySidebar from "./game-library-sidebar";
import GameLibraryMainContent from "./game-library-main-content";

export default function GameLibrary() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Genre>();
  const [games, setGames] = useState<GameDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGenres() {
      try {
        const data = await fetchGenres();
        setGenres(data);
        if (data.length > 0) {
          setSelectedGenre(data[0]);
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    }
    loadGenres();
  }, []);

  useEffect(() => {
    if (selectedGenre) {
      const loadGames = async () => {
        try {
          const data = await fetchGamesByGenre(selectedGenre.id);
          setGames(data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching games:", error);
        }
      };
      loadGames();
    }
  }, [selectedGenre]);

  return (
    <div className="flex h-screen bg-background text-foreground">
      <GameLibrarySidebar
        genres={genres}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        loading={loading}
      />
      <GameLibraryMainContent
        selectedGenre={selectedGenre}
        games={games}
        loading={loading}
      />
    </div>
  );
}
