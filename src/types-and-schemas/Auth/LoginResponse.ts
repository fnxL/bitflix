import { Role } from "@prisma/client";
import { Type, Static } from "@sinclair/typebox";

export const LoginResponse = Type.Object({
  status: Type.String(),
  message: Type.String(),
  userData: Type.Object({
    id: Type.String(),
    username: Type.String(),
    role: Type.Enum(Role),
    createdAt: Type.Optional(Type.Any()),
  }),
  accessToken: Type.String(),
  refreshToken: Type.String(),
});
