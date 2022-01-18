import { Type, Static } from "@sinclair/typebox";
import { FastifyRequest } from "fastify";
export const LoginRequest = Type.Object({
  username: Type.String({ minLength: 3 }),
  password: Type.String({ minLength: 4 }),
});

export type LoginRequestType = Static<typeof LoginRequest>;
export type LoginFastifyRequest = FastifyRequest<{ Body: LoginRequestType }>;
