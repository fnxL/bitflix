import { UserType } from "../types-and-schemas";

declare module "fastify" {
  interface FastifyRequest {
    user: UserType;
  }
  interface FastifyInstance {
    verifyUser: () => void;
    verifyAdmin: () => void;
  }
}
