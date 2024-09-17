import { NextResponse } from "next/server";
import axios, { AxiosResponse } from "axios";
import { Repack } from "@/common/types";

interface RepackSource {
  name: string;
  downloads: Repack[];
}

async function fetchRepackData(url: string): Promise<RepackSource | null> {
  try {
    const response: AxiosResponse<RepackSource> = await axios.get(url);
    return response.data;
  } catch (error: any) {
    console.error(`Failed to fetch data from ${url}:`, error.message);
    return null;
  }
}

function processRepackData(
  data: RepackSource | null,
  repackerName: string
): Repack[] {
  if (!data || !data.downloads) return [];
  return data.downloads.slice(0, 50).map((repack) => ({
    ...repack,
    repacker: repackerName,
  }));
}

export async function GET(): Promise<NextResponse> {
  try {
    const urls = {
      fitgirl: "https://hydralinks.cloud/sources/fitgirl.json",
      dodi: "https://hydralinks.cloud/sources/dodi.json",
    };

    const [fitgirlData, dodiData] = await Promise.all([
      fetchRepackData(urls.fitgirl),
      fetchRepackData(urls.dodi),
    ]);

    const fitgirlRepacks = processRepackData(fitgirlData, "FitGirl");
    const dodiRepacks = processRepackData(dodiData, "Dodi");

    const combinedRepacks = [...fitgirlRepacks, ...dodiRepacks];
    combinedRepacks.sort(
      (a, b) =>
        new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    );

    return NextResponse.json(combinedRepacks);
  } catch (error: any) {
    console.error("Error processing repacks:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch and combine repack data." },
      { status: 500 }
    );
  }
}
