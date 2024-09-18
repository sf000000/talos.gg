import { NextResponse } from "next/server";
import axios, { AxiosResponse } from "axios";
import {
  GitHubAPICommit,
  GitHubAPICommitDetails,
  GitHubCommit,
} from "@/common/types";

// Fetch commits from the repository
async function fetchCommits(
  url: string,
  headers: Record<string, string>
): Promise<GitHubAPICommit[]> {
  try {
    const response: AxiosResponse<GitHubAPICommit[]> = await axios.get(url, {
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

// Fetch commit details to get stats
async function fetchCommitDetails(
  url: string,
  headers: Record<string, string>
): Promise<GitHubAPICommitDetails | undefined> {
  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error: unknown) {
    console.error(`Failed to fetch commit details from ${url}:`, String(error));
    return undefined;
  }
}

// Process commits to match the GitHubCommit interface
function processCommits(commits: GitHubAPICommit[]): GitHubCommit[] {
  return commits.map((commit: GitHubAPICommit) => {
    const date = commit.commit.author.date;
    const [commitDate, time] = date.split("T");
    const cleanTime = time.split("Z")[0];

    return {
      sha: commit.sha,
      message: commit.commit.message,
      date: commitDate,
      time: cleanTime,
      author: commit.commit.author.name,
      url: commit.html_url,
      additions: commit.stats?.additions || 0,
      deletions: commit.stats?.deletions || 0,
      avatar: commit.author?.avatar_url || commit.committer?.avatar_url || "",
    };
  });
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

    const commitsWithDetails = await Promise.all(
      commitsData.map(async (commit) => {
        const detailsUrl = `https://api.github.com/repos/${owner}/${repo}/commits/${commit.sha}`;
        const details = await fetchCommitDetails(detailsUrl, headers);
        return {
          ...commit,
          stats: details?.stats,
        };
      })
    );

    const processedCommits = processCommits(commitsWithDetails);
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
