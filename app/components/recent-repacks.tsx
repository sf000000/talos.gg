"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Repack } from "@/common/types";
import { useEffect, useState } from "react";
import { truncate } from "@/lib/utils";
import Link from "next/link";
import { MagnetIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const RecentRepacks = () => {
  const [repacks, setRepacks] = useState<Repack[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/repacks")
      .then((response) => response.json())
      .then((data) => {
        setRepacks(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <h2 className="text-xl font-semibold">Recent Repacks</h2>
        <p className="text-sm text-muted-foreground">
          The latest repacks from trusted sources
        </p>
      </div>
      <ScrollArea className="h-72 w-full rounded-md border p-4">
        {loading
          ? Array.from({ length: 20 }).map((_, idx) => (
              <div className="flex flex-col gap-y-2" key={idx}>
                <div className="h-6 w-full bg-primary/20 animate-pulse" />
                <Separator />
              </div>
            ))
          : repacks.map((repack, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-x-2 p-1">
                  <Link href={repack.uris[0]}>
                    <Badge variant="outline">
                      <MagnetIcon size={16} />
                    </Badge>
                  </Link>
                  <h3>{truncate(repack.title, 100)}</h3>
                  <Badge variant="outline">{repack.fileSize}</Badge>
                  <Badge variant="outline">{repack.repacker}</Badge>
                </div>
                <Separator />
              </div>
            ))}
      </ScrollArea>
    </div>
  );
};

export default RecentRepacks;
