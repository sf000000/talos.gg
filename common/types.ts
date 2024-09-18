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

export interface Commit {
  sha: string;
  message: string;
  date: string;
  author: string;
  url: string;
}
