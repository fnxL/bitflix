import { Type, Static } from "@sinclair/typebox";

export const ResponseSchema = Type.Object({
  status: Type.Optional(Type.String()),
  message: Type.Optional(Type.String()),
  statusCode: Type.Optional(Type.String()),
});

export type ResponseType = Static<typeof ResponseSchema>;
