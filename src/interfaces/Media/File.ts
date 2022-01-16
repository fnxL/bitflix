import { Quality } from "./Quality";

export interface File {
  name?: string;
  url?: string;
  size?: string;
  quality?: Quality;
}

export interface Links {
  ultraHD: File[];
  fullHD: File[];
  hd: File[];
}
