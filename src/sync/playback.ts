import { PrismaClient } from "@prisma/client";
import { Status } from "@util/Status";
import { FastifyInstance, FastifyLoggerInstance, RouteShorthandOptions } from "fastify";
import { Container } from "typedi";
import {
  PausePlaybackSchema,
  PausePlaybackType,
  StartPlaybackResponseSchema,
  StartPlaybackResponseType,
  StartPlaybackSchema,
  StartPlaybackType,
  StopPlayBackSchema,
} from "./schema";
import { StopPlaybackType } from "./schema/Playback";
import SyncService from "./syncService";

const logger: FastifyLoggerInstance = Container.get("logger");
const syncService = Container.get(SyncService);

const StartPlaybackOptions: RouteShorthandOptions = {
  schema: {
    description: "Start playback of movie or episode",
    summary: "Start playback",
    tags: ["Sync"],
    body: StartPlaybackSchema,
    response: {
      201: StartPlaybackResponseSchema,
    },
  },
};

const PauseOptions: RouteShorthandOptions = {
  schema: {
    description: "Pause playback of a movie or a episdoe",
    summary: "Pause",
    tags: ["Sync"],
    body: PausePlaybackSchema,
  },
};

const StopOptions: RouteShorthandOptions = {
  schema: {
    description: "",
    summary: "",
    tags: ["Sync"],
    body: StopPlayBackSchema,
  },
};

export default async function (fastify: FastifyInstance) {
  fastify.addHook("preHandler", fastify.auth([fastify.verifyUser]));

  fastify.post<{ Body: StartPlaybackType; Reply: StartPlaybackResponseType }>(
    "/start",
    StartPlaybackOptions,
    async (req, res) => {
      const result = await syncService.start(req.body, req.user.id);

      res.send({
        status: Status.SUCCESS,
        message: "",
        ...result,
      });
    }
  );

  fastify.post<{ Body: PausePlaybackType }>("/pause", PauseOptions, async (req, res) => {
    const result = await syncService.pause(req.body, req.user.id);

    res.send({
      status: Status.SUCCESS,
      message: "",
      ...result,
    });
  });

  fastify.post<{ Body: StopPlaybackType }>("/stop", PauseOptions, async (req, res) => {
    /* TODO: 
        Remove the entry from playback list and put it in watch history.
    */
  });
}
