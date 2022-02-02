import { Static, Type, TSchema } from "@sinclair/typebox";

export interface File {
  name?: string;
  url?: string;
  size?: string;
}

export enum Platform {
  WEB = "web",
  ANDROID = "android",
  ANDROID_TV = "tv",
}

export enum Quality {
  ULTRA_HD = "2160",
  FULL_HD = "1080",
  HD = "720",
}

export enum Order {
  ASCENDING,
  DESCENDING,
}

export enum MediaType {
  TV = "tv",
  MOVIE = "movie",
}

export interface Rules {
  mimeType: {
    contains: string[];
  };
  fullText: {
    contains: string[];
    exclude?: string[];
  };
}

export type RuleValue = Rules["fullText"];

export const StreamLinksSchema = Type.Object({
  title: Type.String(),
  year: Type.Optional(Type.String()),
  seasonNumber: Type.Optional(Type.Number()),
  episodeNumber: Type.Optional(Type.Number()),
  platform: Type.Enum(Platform),
  isFireFox: Type.Optional(Type.Boolean()),
  type: Type.Enum(MediaType),
});
export type StreamLinksType = Static<typeof StreamLinksSchema>;

export const StreamLinksResponseSchema = Type.Object({
  ultraHD: Type.Array(
    Type.Object({
      name: Type.Optional(Type.String()),
      url: Type.Optional(Type.String()),
      size: Type.Optional(Type.String()),
    })
  ),
  fullHD: Type.Array(
    Type.Object({
      name: Type.Optional(Type.String()),
      url: Type.Optional(Type.String()),
      size: Type.Optional(Type.String()),
    })
  ),
  hd: Type.Array(
    Type.Object({
      name: Type.Optional(Type.String()),
      url: Type.Optional(Type.String()),
      size: Type.Optional(Type.String()),
    })
  ),
});
export type StreamLinksResponseType = Static<typeof StreamLinksResponseSchema>;

export const PlayParams = Type.Object({
  name: Type.String(),
});
export type PlayParamsType = Static<typeof PlayParams>;

export const PlayQueryString = Type.Object({
  id: Type.String(),
});
export type PlayQueryStringType = Static<typeof PlayQueryString>;

export interface SearchParams {
  fileName: string;
  quality: Quality;
  type: MediaType;
  platform: Platform;
  isFireFox?: Boolean;
  pageSize?: number;
}
