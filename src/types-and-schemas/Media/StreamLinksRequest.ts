import { Type, Static } from "@sinclair/typebox";
import { Platform } from "./PlatformEnum";
import { FastifyRequest } from "fastify";

export const StreamLinksRequest = Type.Object({
  title: Type.String(),
  year: Type.Optional(Type.String()),
  seasonNumber: Type.Optional(Type.Number()),
  episodeNumber: Type.Optional(Type.Number()),
  platform: Type.Enum(Platform),
  isFireFox: Type.Optional(Type.Boolean()),
  type: Type.String(),
});

export type StreamLinksRequestType = Static<typeof StreamLinksRequest>;
export type StreamLinksFastifyRequest = FastifyRequest<{ Body: StreamLinksRequestType }>;
