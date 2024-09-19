"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { GitHubCommit } from "@/common/types";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ChangelogPage = () => {
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/commits")
      .then((res) => res.json())
      .then((data) => {
        setCommits(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full">
                <Card className="border border-black/30 dark:border-primary/5">
                  <CardHeader>
                    <CardTitle>Recent Commits</CardTitle>
                    <CardDescription>
                      Latest updates to the main branch
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[calc(100vh-300px)]">
                      {loading ? (
                        <>
                          {Array.from({ length: 8 }).map((_, index) => (
                            <div key={index} className="mb-6 last:mb-0">
                              <div className="flex items-start space-x-4">
                                <Avatar className="border border-black/30 dark:border-primary/10">
                                  <AvatarFallback>GH</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1 flex-1">
                                  <div className="w-96 h-4 bg-black/30 dark:bg-primary/10 rounded-md animate-pulse" />
                                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                    <span>GitHub</span>
                                    <span>•</span>
                                    <span className="font-mono">0000000</span>
                                    <span>•</span>
                                    <span>Just now</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        commits.map((commit, index) => (
                          <div key={index} className="mb-6 last:mb-0">
                            <div className="flex items-start space-x-4">
                              <Avatar>
                                <AvatarImage
                                  src={commit.avatar}
                                  alt={commit.author}
                                />
                                <AvatarFallback>
                                  {commit.author.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="space-y-1 flex-1">
                                <p className="text-sm font-medium">
                                  {commit.message}
                                </p>
                                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                  <span>{commit.author}</span>
                                  <span>•</span>
                                  <span className="font-mono">
                                    <Link
                                      href={commit.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="hover:underline text-blue-500"
                                    >
                                      {commit.sha.slice(0, 7)}
                                    </Link>
                                  </span>
                                  <span>•</span>
                                  <span>{commit.date}</span>
                                  <span>{commit.time}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-xs">
                                  <Badge
                                    variant="outline"
                                    className="text-green-600"
                                  >
                                    +{commit.additions}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className="text-red-600"
                                  >
                                    -{commit.deletions}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChangelogPage;
