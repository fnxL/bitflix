import "reflect-metadata";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { Container } from "typedi";
import GDriveService from "./oauthService";
import { ApiError } from "../utils/ApiError";
import { Status } from "../utils/Status";

const gdriveService = Container.get(GDriveService);

async function oauthRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  /**
   * Authorization URL for authenticating the app with a google account
   *
   */
  fastify.get("/url", async (request, reply) => {
    const url = await gdriveService.generateAuthUrl();
    reply.send({
      status: Status.SUCCESS,
      url,
    });
  });

  /**
   * Callback endpoint after validating the app using google account
   * @param {string} code - code received after authorization
   */
  fastify.get<{ Querystring: { code: string } }>("/callback", async (request, reply) => {
    if (request.query.code) {
      const tokens = await gdriveService.getTokens(request.query.code);
      reply.send({
        status: Status.SUCCESS,
        data: tokens,
      });
    } else throw new ApiError(400, "No code provided for token exchange");
  });
}

export default oauthRoutes;
