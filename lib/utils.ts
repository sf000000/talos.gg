import { GameDetail } from "@/common/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncate(text: string, length: number) {
  return text.length > length ? text.slice(0, length) + "..." : text;
}

export interface Genre {
  id: number;
  name: string;
}

export async function fetchGenres(): Promise<Genre[]> {
  const response = await fetch("/api/igdb", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      endpoint: "genres",
      query: "fields name; limit 50;",
    }),
  });

  const data = await response.json();
  return data as Genre[];
}

export async function fetchGamesByGenre(
  genreId: number
): Promise<GameDetail[]> {
  const query = `
    fields id, name, cover.image_id;
    where genres = (${genreId}) & cover != null;
    limit 20;
    sort rating_count desc;
  `;

  const response = await fetch("/api/igdb", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      endpoint: "games",
      query,
    }),
  });

  const data = (await response.json()) as any[];

  const gamesWithCoverUrl = data.map((game) => {
    let coverUrl = null;
    if (game.cover && game.cover.image_id) {
      coverUrl = `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`;
    }
    return {
      ...game,
      cover: coverUrl ? { url: coverUrl } : undefined,
    };
  });

  return gamesWithCoverUrl as GameDetail[];
}
