import { Static, Type, TSchema } from "@sinclair/typebox";
import { Platform } from ".";

export const StreamLinksSchema = Type.Object({
  title: Type.String(),
  year: Type.Optional(Type.String()),
  seasonNumber: Type.Optional(Type.Number()),
  episodeNumber: Type.Optional(Type.Number()),
  platform: Type.Enum(Platform),
  isFireFox: Type.Optional(Type.Boolean()),
  type: Type.String(),
});

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

export const PlayParams = Type.Object({
  name: Type.String(),
});

export type PlayParamsType = Static<typeof PlayParams>;

export const PlayQueryString = Type.Object({
  id: Type.String(),
});

export type PlayQueryStringType = Static<typeof PlayQueryString>;

export type StreamLinksType = Static<typeof StreamLinksSchema>;
export type StreamLinksResponseType = Static<typeof StreamLinksResponseSchema>;
