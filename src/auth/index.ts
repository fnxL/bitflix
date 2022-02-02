import { FastifyInstance } from "fastify";

import auth from "./auth";
import invitekey from "./invitekey";
import token from "./token";
import verifySession from "./verifySession";
import createAdmin from "./createAdmin";

export default async function (fastify: FastifyInstance) {
  fastify.register(auth);
  fastify.register(invitekey);
  fastify.register(token);
  fastify.register(verifySession);
  fastify.register(createAdmin);
}
