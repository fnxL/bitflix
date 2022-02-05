import { FastifyInstance } from "fastify";
import createAdmin from "./createAdmin";
import invitekey from "./invitekey";

export default async function (fastify: FastifyInstance) {
  fastify.addHook("preHandler", fastify.auth([fastify.verifyAdmin]));
  fastify.register(invitekey);
  fastify.register(createAdmin);
}
