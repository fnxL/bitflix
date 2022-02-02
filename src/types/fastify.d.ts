import { RequestHeadersDefault } from "fastify";
import { UserPayload } from "src/auth/schema";

declare module "fastify" {
  interface FastifyRequest {
    user: UserPayload;
  }
  interface FastifyInstance {
    verifyUser: () => void;
    verifyAdmin: () => void;
  }
}
