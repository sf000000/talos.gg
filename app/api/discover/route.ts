import { NextResponse } from "next/server";
import axios, { AxiosResponse } from "axios";
import { GameDetail } from "@/common/types";

export const revalidate: number = 60 * 60; // 1 hour

interface PopularityPrimitive {
  game_id: number;
  value: number;
}

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
  } catch (error: any) {
    console.error("Failed to obtain Twitch token:", error.message);
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

// [
//   { id: 1, name: 'Visits' },
//   { id: 4, name: 'Played' },
//   { id: 3, name: 'Playing' },
//   { id: 2, name: 'Want to Play' }
// ]

async function fetchPopularityPrimitives(
  token: string
): Promise<PopularityPrimitive[] | null> {
  try {
    const response: AxiosResponse<PopularityPrimitive[]> = await axios.post(
      "https://api.igdb.com/v4/popularity_primitives",
      `fields game_id, value; sort value desc; limit 20; where popularity_type = 2;`,
      {
        headers: {
          "Client-ID": process.env.TWITCH_CLIENT_ID!,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to fetch popularity primitives from IGDB:",
      error.message
    );
    return null;
  }
}

async function fetchGameDetails(
  token: string,
  gameIds: number[]
): Promise<GameDetail[] | null> {
  try {
    const response: AxiosResponse<GameDetail[]> = await axios.post(
      "https://api.igdb.com/v4/games",
      `fields id, name, summary, cover.image_id, platforms.name, first_release_date; where id = (${gameIds.join(
        ","
      )});`,
      {
        headers: {
          "Client-ID": process.env.TWITCH_CLIENT_ID!,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch game details from IGDB:", error.message);
    return null;
  }
}

export async function GET(): Promise<NextResponse> {
  const token = await getValidTwitchToken();
  if (!token) {
    return NextResponse.json({ error: "Failed to obtain Twitch token." });
  }

  const popularityPrimitives = await fetchPopularityPrimitives(token);
  if (!popularityPrimitives) {
    return NextResponse.json({
      error: "Failed to fetch popularity primitives.",
    });
  }

  const gameIds = popularityPrimitives.map((primitive) => primitive.game_id);
  const games = await fetchGameDetails(token, gameIds);

  if (!games) {
    return NextResponse.json({ error: "Failed to fetch game details." });
  }

  const gamesWithCovers = games.map((game) => {
    let coverUrl = null;
    if (game.cover && game.cover.image_id) {
      coverUrl = `https://images.igdb.com/igdb/image/upload/t_1080p/${game.cover.image_id}.jpg`;
    }
    return {
      ...game,
      cover: { url: coverUrl },
    };
  });

  return NextResponse.json(gamesWithCovers);
}
