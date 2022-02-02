import { PrismaClient } from "@prisma/client";
import { ApiError } from "@util/ApiError";
import { FastifyLoggerInstance } from "fastify";
import { Inject, Service } from "typedi";
import { StartPlaybackType } from "./schema";
import { PausePlaybackType, StopPlaybackType } from "./schema/Playback";

@Service()
class SyncService {
  constructor(
    @Inject("logger") private logger: FastifyLoggerInstance,
    @Inject("prisma") private prisma: PrismaClient
  ) {
    logger.info("Sync Service initialized...");
  }

  private async playbackExists(userId: string, tmdbId: number) {
    return await this.prisma.playback.findFirst({
      where: {
        userId,
        tmdbId,
      },
    });
  }
  async start(data: StartPlaybackType, userId: string) {
    // dont want to start multiple instances of playback,
    // check for already existing playback
    const { tmdbId, progress } = data;

    const playbackExists = await this.playbackExists(userId, tmdbId);

    if (playbackExists) throw new ApiError(400, "Playback session already exists.");

    return await this.prisma.playback.create({
      data: {
        userId,
        movie: {
          create: {
            title: data.movie.title,
          },
        },
        progress,
        tmdbId,
      },
    });
  }

  async pause(playbackData: PausePlaybackType, userId: string) {
    const playbackExists = await this.playbackExists(userId, playbackData.tmdbId);

    if (!playbackExists) throw new ApiError(400, "Playback doesn't exists for this title");

    return await this.prisma.playback.update({
      where: {
        id: playbackExists.id,
      },
      data: {
        ...playbackData,
      },
    });
  }

  async stop(data: StopPlaybackType, userId: string) {
    const playbackExists = await this.playbackExists(userId, data.tmdbId);
    if (!playbackExists) throw new ApiError(400, "Playback doesn't exists for this title");

    /* TODO: 
        Remove the entry from playback list and put it in watch history.
    */
  }
}

export default SyncService;
