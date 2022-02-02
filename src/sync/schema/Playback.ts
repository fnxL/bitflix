import { Type, Static } from "@sinclair/typebox";

export const StartPlaybackSchema = Type.Object({
  progress: Type.Number(),
  tmdbId: Type.Number(),
  movie: Type.Object({
    title: Type.String(),
    backdrop_path: Type.Optional(Type.String()),
    poster_path: Type.Optional(Type.String()),
  }),
});

export type StartPlaybackType = Static<typeof StartPlaybackSchema>;

export const StartPlaybackResponseSchema = Type.Object({
  status: Type.String(),
  message: Type.String(),
  id: Type.String(),
  progress: Type.Number(),
  tmdbId: Type.Number(),
  movie: Type.Optional(
    Type.Object({
      title: Type.String(),
      backdrop_path: Type.Optional(Type.String()),
      poster_path: Type.Optional(Type.String()),
      playbackId: Type.Optional(Type.String()),
    })
  ),
});

export type StartPlaybackResponseType = Static<typeof StartPlaybackResponseSchema>;

export const PausePlaybackSchema = Type.Object({
  progress: Type.Number(),
  tmdbId: Type.Number(),
});

export type PausePlaybackType = Static<typeof PausePlaybackSchema>;

export const StopPlayBackSchema = Type.Object({
  tmdbId: Type.Number(),
});

export type StopPlaybackType = Static<typeof StopPlayBackSchema>;
