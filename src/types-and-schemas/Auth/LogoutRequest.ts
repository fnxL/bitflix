import { Type, Static, TSchema } from "@sinclair/typebox";

const Nullable = <T extends TSchema>(type: T) => Type.Union([type, Type.Null()]);

export const LogoutRequest = Nullable(
  Type.Object({
    token: Type.Optional(Type.String()),
  })
);

export type LogoutRequestType = Static<typeof LogoutRequest>;
