import { Static, Type, TSchema } from "@sinclair/typebox";

export const URLResponseSchema = Type.Object({
  status: Type.Optional(Type.String()),
  url: Type.String(),
});

export type URLResponseType = Static<typeof URLResponseSchema>;

export const CallbackParamSchema = Type.Object({
  code: Type.String(),
});
