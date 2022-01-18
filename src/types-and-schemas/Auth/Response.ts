import { Type } from "@sinclair/typebox";

export const Response = Type.Object({
  status: Type.String(),
  message: Type.String(),
  statusCode: Type.Optional(Type.Number()),
  inviteKey: Type.Optional(Type.String()),
});
