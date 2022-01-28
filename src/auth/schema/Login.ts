import { Role } from "@prisma/client";
import { Type, Static } from "@sinclair/typebox";

export const LoginSchema = Type.Object({
  username: Type.String({ minLength: 3 }),
  password: Type.String({ minLength: 4 }),
});

export const LoginResponseSchema = Type.Object({
  status: Type.String(),
  message: Type.String(),
  user: Type.Object({
    id: Type.String(),
    username: Type.String(),
    role: Type.Enum(Role),
    createdAt: Type.Optional(Type.Any()),
  }),
  accessToken: Type.String(),
  refreshToken: Type.String(),
});

export type LoginType = Static<typeof LoginSchema>;
export type LoginResponseType = Static<typeof LoginResponseSchema>;
