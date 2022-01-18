import { Platform, Quality } from "..";

export interface SearchParams {
  fileName: string;
  quality: Quality;
  platform: Platform;
  isFireFox?: Boolean;
  pageSize?: number;
}
