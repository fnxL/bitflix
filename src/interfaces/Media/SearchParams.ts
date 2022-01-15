import { Platform } from "./Platform";

export interface SearchParams {
  fileName: string;
  quality: Quality;
  platform: Platform;
  isFireFox?: Boolean;
  pageSize?: number;
}
