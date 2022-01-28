import { Platform } from "./PlatformEnum";
import { Quality } from "./QualityEnum";

export interface SearchParams {
  fileName: string;
  quality: Quality;
  platform: Platform;
  isFireFox?: Boolean;
  pageSize?: number;
}
