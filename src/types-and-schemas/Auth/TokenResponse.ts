import { Role } from "@prisma/client";
import { Type, Static } from "@sinclair/typebox";

export const TokenResponse = Type.Object({
  status: Type.String(),
  message: Type.String(),
  accessToken: Type.String(),
});
