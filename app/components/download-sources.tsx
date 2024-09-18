import { GameDetail } from "@/common/types";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MagnetIcon } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { useState, useEffect } from "react";

interface DownloadSourcesProps {
  game: GameDetail;
}

interface Repack {
  title: string;
  uris: string[];
  uploadDate: string;
  fileSize: string;
  repacker: string;
}

const DownloadSources = ({ game }: DownloadSourcesProps) => {
  const [repacks, setRepacks] = useState<Repack[]>([]);
  const [loading, setLoading] = useState(true);

  function normalizeString(str: string): string {
    return str.toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  function isMatch(gameName: string, repackTitle: string): boolean {
    const normalizedGameName = normalizeString(gameName);
    const normalizedRepackTitle = normalizeString(repackTitle);
    return normalizedRepackTitle.includes(normalizedGameName);
  }

  useEffect(() => {
    const fetchRepacks = async () => {
      try {
        const response = await fetch("/api/repacks");
        const data = await response.json();

        const matchingRepacks = data.filter((repack: Repack) => {
          return isMatch(game.name, repack.title);
        });

        setRepacks(matchingRepacks);
      } catch (error) {
        console.error("Error fetching repacks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepacks();
  }, [game]);

  return (
    <div>
      <h1 className="font-semibold ">Downloads</h1>
      <ScrollArea className="border h-[640px] border-black/30 px-2 py-3 rounded-md mt-2">
        <div className="p-4">
          {loading ? (
            <p>Loading...</p>
          ) : repacks.length > 0 ? (
            repacks.map((repack) => (
              <div key={repack.title} className="mb-4">
                <h2 className="font-semibold line-clamp-1">{repack.title}</h2>
                <div className="flex space-x-2 mt-2">
                  {repack.uris.map((uri) => (
                    <div
                      key={uri}
                      className="flex items-center justify-between gap-x-2"
                    >
                      <Link href={uri} passHref>
                        <Badge className="flex items-center gap-x-2">
                          <MagnetIcon className="cursor-pointer w-4 h-4" />
                          Magnet
                        </Badge>
                      </Link>
                      <Badge
                        className="flex items-center gap-x-2"
                        variant="secondary"
                      >
                        {repack.fileSize}
                      </Badge>
                      <Badge
                        className="flex items-center gap-x-2"
                        variant="secondary"
                      >
                        {moment(repack.uploadDate).format("MMMM D, YYYY")}
                      </Badge>
                      <Badge
                        className="flex items-center gap-x-2"
                        variant="secondary"
                      >
                        {repack.repacker}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>No download sources found for this game.</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DownloadSources;
