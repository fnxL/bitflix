import { Platform } from "./Platform";
import { Quality } from "./Quality";

export interface SearchParams {
  fileName: string;
  quality: Quality;
  platform: Platform;
  isFireFox?: Boolean;
  pageSize?: number;
}
