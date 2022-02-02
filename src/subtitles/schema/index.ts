import { Type, Static } from "@sinclair/typebox";

export const SubtitlesSchema = Type.Object({
  sublanguageid: Type.String(),
  filename: Type.String(),
  filesize: Type.String(),
  season: Type.String(),
  episode: Type.String(),
  extensions: Type.Array(Type.String()),
  imdbid: Type.String(),
});

export type SubtitlesType = Static<typeof SubtitlesSchema>;
