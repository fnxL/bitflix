import { ResponseSchema } from "@schema";
import { FastifyInstance, RouteShorthandOptions } from "fastify";
import { Status } from "@util/Status";
import { Container } from "typedi";
import AuthService from "./authService";
import { KeySchema } from "./schema";

const authService = Container.get(AuthService);

const GenerateOptions: RouteShorthandOptions = {
  schema: {
    description: "Generate an invite key which is requried while registering a new account",
    summary: "Generate invite key",
    tags: ["Authentication"],
    response: {
      200: ResponseSchema,
    },
  },
};

export default async function (fastify: FastifyInstance): Promise<void> {
  const KeyOptions: RouteShorthandOptions = {
    preHandler: fastify.auth([fastify.verifyAdmin]),
    schema: {
      description: "Get a list of all invite keys available.",
      summary: "Invite keys",
      tags: ["Authentication"],
      response: {
        200: KeySchema,
      },
    },
  };

  fastify.get("/keys/generate", GenerateOptions, async (req, res) => {
    const key = await authService.generateKey();
    res.status(201).send({
      status: Status.SUCCESS,
      message: "Invite key generated successfully",
      ...(key as {}),
    });
  });

  fastify.get("/keys", KeyOptions, async (req, res) => {
    const keys = await authService.getInviteKeys();
    res.status(200).send({
      status: Status.SUCCESS,
      keys,
    });
  });
}
