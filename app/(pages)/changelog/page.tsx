"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Commit } from "@/common/types";
import { useState, useEffect } from "react";
import Link from "next/link";
import moment from "moment";

const ChangelogPage = () => {
  const [commits, setCommits] = useState<Commit[]>([]);

  useEffect(() => {
    fetch("/api/commits")
      .then((res) => res.json())
      .then((data) => {
        setCommits(data);
      });
  }, []);

  return (
    <ScrollArea className="container mx-auto p-4 mt-20 border rounded-md h-[768px]">
      <div>
        {commits.map((commit) => (
          <div
            key={commit.sha}
            className="mb-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-x-2">
              <Link href={commit.url} target="_blank">
                <span className="font-mono text-blue-600 hover:underline">
                  {commit.sha.substring(0, 7)}
                </span>
              </Link>
              {commit.message}
            </div>
            <span>{moment(commit.date).fromNow()}</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ChangelogPage;
