import { Type, Static } from "@sinclair/typebox";
import { FastifyRequest } from "fastify";

export const subtitlesRequest = Type.Object({
  sublanguageid: Type.String(),
  filename: Type.String(),
  filesize: Type.String(),
  season: Type.String(),
  episode: Type.String(),
  extensions: Type.Array(Type.String()),
  imdbid: Type.String(),
});

export type subtitlesRequestType = Static<typeof subtitlesRequest>;
