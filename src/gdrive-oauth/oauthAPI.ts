import { FastifyInstance, RouteShorthandOptions } from "fastify";
import "reflect-metadata";
import { Container } from "typedi";
import { ApiError } from "../utils/ApiError";
import { Status } from "../utils/Status";
import GDriveService from "./oauthService";
import { CallbackParamSchema, URLResponseSchema, URLResponseType } from "./schema";

const gdriveService = Container.get(GDriveService);

const URLOptions: RouteShorthandOptions = {
  schema: {
    description: "Generate authorization URL for authenticating the app with a google account",
    summary: "Generate authorization url",
    tags: ["gdrive-oauth"],
    response: {
      200: URLResponseSchema,
    },
  },
};

const CallbackOptions: RouteShorthandOptions = {
  schema: {
    description: "Callback endpoint after validating the app using a google account",
    summary: "Callback endpoint",
    tags: ["gdrive-oauth"],
    params: CallbackParamSchema,
  },
};

export default async function (fastify: FastifyInstance) {
  /**
   * Authorization URL for authenticating the app with a google account
   *
   */
  fastify.get<{ Reply: URLResponseType }>("/url", URLOptions, async (req, res) => {
    const url = await gdriveService.generateAuthUrl();
    res.status(200).send({
      status: Status.SUCCESS,
      url,
    });
  });

  fastify.get<{ Querystring: { code: string } }>(
    "/callback",
    CallbackOptions,
    async (request, reply) => {
      if (request.query.code) {
        const tokens = await gdriveService.getTokens(request.query.code);
        reply.send({
          status: Status.SUCCESS,
          data: tokens,
        });
      } else throw new ApiError(400, "No code provided for token exchange");
    }
  );
}
