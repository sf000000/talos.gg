import { NextResponse } from "next/server";
import axios, { AxiosResponse } from "axios";
import { Commit } from "@/common/types";

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
  html_url: string;
}

async function fetchCommits(
  url: string,
  headers: Record<string, string>
): Promise<GitHubCommit[]> {
  try {
    const response: AxiosResponse<GitHubCommit[]> = await axios.get(url, {
      headers,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Failed to fetch commits from ${url}:`, error.message);
    } else {
      console.error(`Failed to fetch commits from ${url}:`, String(error));
    }
    return [];
  }
}

function processCommits(commits: GitHubCommit[]): Commit[] {
  return commits.map((commit: GitHubCommit) => ({
    sha: commit.sha,
    message: commit.commit.message,
    date: commit.commit.author.date,
    author: commit.commit.author.name,
    url: commit.html_url,
  }));
}

export async function GET(): Promise<NextResponse> {
  try {
    const repoName = process.env.REPO_NAME;
    const githubToken = process.env.GITHUB_TOKEN;

    if (!repoName) {
      return NextResponse.json(
        { error: "REPO_NAME environment variable is not set." },
        { status: 500 }
      );
    }

    const [owner, repo] = repoName.split("/");

    if (!owner || !repo) {
      return NextResponse.json(
        { error: "REPO_NAME must be in the format 'owner/repo'." },
        { status: 500 }
      );
    }

    const url = `https://api.github.com/repos/${owner}/${repo}/commits`;

    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
    };

    if (githubToken) {
      headers.Authorization = `Bearer ${githubToken}`;
    }

    const commitsData = await fetchCommits(url, headers);

    const processedCommits = processCommits(commitsData);

    const latestCommits = processedCommits.slice(0, 50);

    return NextResponse.json(latestCommits);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching commits:", error.message);
    } else {
      console.error("Error fetching commits:", String(error));
    }
    return NextResponse.json(
      { error: "Failed to fetch commits from the repository." },
      { status: 500 }
    );
  }
}
