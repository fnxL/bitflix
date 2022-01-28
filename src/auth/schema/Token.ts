import { Static, Type, TSchema } from "@sinclair/typebox";

const Nullable = <T extends TSchema>(type: T) => Type.Union([type, Type.Null()]);

export const TokenSchema = Nullable(
  Type.Object({
    token: Type.Optional(Type.String()),
  })
);

export type TokenType = Static<typeof TokenSchema>;

export const TokenResponseSchema = Type.Object({
  status: Type.Optional(Type.String()),
  message: Type.Optional(Type.String()),
  accessToken: Type.String(),
});

export type TokenResponseType = Static<typeof TokenResponseSchema>;
