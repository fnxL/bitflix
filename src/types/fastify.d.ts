import { StrippedUserData } from "../types-and-schemas";
import { RequestHeadersDefault } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    user: StrippedUserData;
  }
  interface FastifyInstance {
    verifyUser: () => void;
    verifyAdmin: () => void;
  }
}
