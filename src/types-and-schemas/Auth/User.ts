import { Type, Static } from "@sinclair/typebox";
import { Role } from "@prisma/client";
import { FastifyRequest } from "fastify";

export const User = Type.Object({
  id: Type.Optional(Type.String()),
  role: Type.Optional(Type.Enum(Role)),
  firstName: Type.String({ minLength: 2 }),
  lastName: Type.String({ minLength: 2 }),
  username: Type.String({ minLength: 3 }),
  password: Type.Optional(Type.String({ minLength: 4 })),
  email: Type.String({ format: "email" }),
  inviteKey: Type.Optional(Type.String()),
});

export type UserType = Static<typeof User>;
export type SignUpFastifyRequest = FastifyRequest<{
  Body: UserType;
}>;
