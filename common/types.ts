export interface GameDetail {
  id: number;
  name: string;
  summary?: string;
  cover?: {
    url: string;
    image_id: string;
  };
  platforms?: {
    id: number;
    name: string;
  }[];
  first_release_date?: number;
  aggregated_rating?: number;
  genres?: string[];
}

export interface Repack {
  title: string;
  uris: string[];
  uploadDate: string;
  fileSize: string;
  repacker?: string;
}

export interface GitHubCommit {
  sha: string;
  message: string;
  date: string;
  time: string;
  author: string;
  url: string;
  additions: number;
  deletions: number;
  avatar: string;
}

export interface GitHubAPICommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
    tree: {
      sha: string;
      url: string;
    };
    url: string;
    comment_count: number;
    verification: any;
  };
  author: {
    login: string;
    id: number;
    avatar_url: string;
  } | null;
  committer: {
    login: string;
    id: number;
    avatar_url: string;
  } | null;
  html_url: string;
  stats?: {
    additions: number;
    deletions: number;
    total: number;
  };
}

export interface GitHubAPICommitDetails {
  stats: {
    additions: number;
    deletions: number;
    total: number;
  };
}
