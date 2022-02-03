import { FastifyInstance } from "fastify";

import auth from "./auth";
import token from "./token";
import verifySession from "./verifySession";

export default async function (fastify: FastifyInstance) {
  fastify.register(auth);
  fastify.register(token);
  fastify.register(verifySession);
}
