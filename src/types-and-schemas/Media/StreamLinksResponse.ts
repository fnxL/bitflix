import { Type, Static } from "@sinclair/typebox";

export const StreamLinksResponse = Type.Object({
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

export type StreamLinksResponseType = Static<typeof StreamLinksResponse>;
