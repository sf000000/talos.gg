import { NextRequest, NextResponse } from "next/server";

const TWITCH_TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const IGDB_API_URL = "https://api.igdb.com/v4";

let accessToken: string | null = null;
let tokenExpiry: number | null = null;

interface TwitchTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface IGDBRequestBody {
  endpoint: string;
  query: string;
}

async function getAccessToken(): Promise<string> {
  if (accessToken && tokenExpiry && tokenExpiry > Date.now()) {
    return accessToken;
  }

  const params = new URLSearchParams();
  params.append("client_id", process.env.TWITCH_CLIENT_ID!);
  params.append("client_secret", process.env.TWITCH_CLIENT_SECRET!);
  params.append("grant_type", "client_credentials");

  const response = await fetch(`${TWITCH_TOKEN_URL}?${params.toString()}`, {
    method: "POST",
  });

  const data = (await response.json()) as TwitchTokenResponse;

  accessToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000;

  return accessToken;
}

export async function POST(request: NextRequest) {
  const { endpoint, query } = (await request.json()) as IGDBRequestBody;

  const token = await getAccessToken();

  const response = await fetch(`${IGDB_API_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Client-ID": process.env.TWITCH_CLIENT_ID!,
      Authorization: `Bearer ${token}`,
      "Content-Type": "text/plain",
    },
    body: query,
  });

  const data = await response.json();

  return NextResponse.json(data);
}
