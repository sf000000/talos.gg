import { NextResponse, NextRequest } from "next/server";
import axios, { AxiosResponse } from "axios";

export const revalidate = 60 * 60; // 1 hour

let twitchToken: string | null = null;
let tokenExpiration: number | null = null;

async function getTwitchToken(): Promise<string | null> {
  try {
    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("Twitch client ID or secret is missing.");
    }

    const response = await axios.post(
      "https://id.twitch.tv/oauth2/token",
      null,
      {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "client_credentials",
        },
      }
    );

    const { access_token, expires_in } = response.data;

    twitchToken = access_token;
    tokenExpiration = Date.now() + expires_in * 1000;

    return twitchToken;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to obtain Twitch token:", error.message);
    } else {
      console.error("Failed to obtain Twitch token:", String(error));
    }
    return null;
  }
}

async function getValidTwitchToken(): Promise<string | null> {
  if (
    !twitchToken ||
    !tokenExpiration ||
    Date.now() > tokenExpiration - 60000
  ) {
    twitchToken = await getTwitchToken();
  }

  return twitchToken;
}

export async function GET(req: NextRequest) {
  const gameId = req.nextUrl.searchParams.get("gameId");

  if (!gameId) {
    return NextResponse.json({ error: "Missing parameter gameId" });
  }

  const token = await getValidTwitchToken();
  if (!token) {
    return NextResponse.json({ error: "Failed to obtain Twitch token." });
  }

  try {
    const response: AxiosResponse<any[]> = await axios.post(
      "https://api.igdb.com/v4/games",
      `fields id, name, summary, cover.image_id, aggregated_rating, platforms.name, first_release_date, genres;
       where id = ${gameId};`,
      {
        headers: {
          "Client-ID": process.env.TWITCH_CLIENT_ID!,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Game not found." });
    }

    let game = data[0];

    let coverUrl = null;
    if (game.cover && game.cover.image_id) {
      coverUrl = `https://images.igdb.com/igdb/image/upload/t_1080p/${game.cover.image_id}.jpg`;
    }

    let genreNames: string[] = [];

    if (game.genres && game.genres.length > 0) {
      const genresResponse: AxiosResponse<any[]> = await axios.post(
        "https://api.igdb.com/v4/genres",
        `fields id, name; where id = (${game.genres.join(",")});`,
        {
          headers: {
            "Client-ID": process.env.TWITCH_CLIENT_ID!,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const genresData = genresResponse.data;

      const genreMap = new Map<number, string>();
      genresData.forEach((genre: { id: number; name: string }) => {
        genreMap.set(genre.id, genre.name);
      });

      genreNames = game.genres.map(
        (genreId: number) => genreMap.get(genreId) || "Unknown"
      );
    }

    const gameDetails = {
      ...game,
      cover: { url: coverUrl },
      genres: genreNames,
    };

    return NextResponse.json(gameDetails);
  } catch (error: any) {
    if (error instanceof Error) {
      console.error("Failed to fetch game details from IGDB:", error.message);
      return NextResponse.json({ error: error.message });
    } else {
      console.error("Failed to fetch game details from IGDB:", String(error));
      return NextResponse.json({ error: "An unknown error occurred." });
    }
  }
}
