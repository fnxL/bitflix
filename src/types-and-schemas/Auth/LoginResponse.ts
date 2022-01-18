import { Role } from "@prisma/client";
import { Type, Static } from "@sinclair/typebox";

export const LoginResponse = Type.Object({
  status: Type.String(),
  message: Type.String(),
  userData: Type.Object({
    id: Type.String(),
    firstName: Type.String(),
    lastName: Type.String(),
    username: Type.String(),
    email: Type.String({ format: "email" }),
    role: Type.Enum(Role),
  }),
  accessToken: Type.String(),
  refreshToken: Type.String(),
});
