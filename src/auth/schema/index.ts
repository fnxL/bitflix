import { Role } from "@prisma/client";
import { Type, Static, TSchema } from "@sinclair/typebox";

const Nullable = <T extends TSchema>(type: T) => Type.Union([type, Type.Null()]);

export const LoginSchema = Type.Object({
  username: Type.String({ minLength: 3 }),
  password: Type.String({ minLength: 4 }),
});
export type LoginType = Static<typeof LoginSchema>;

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
export type LoginResponseType = Static<typeof LoginResponseSchema>;

export const UserSchema = Type.Object({
  firstName: Type.String({ minLength: 2 }),
  lastName: Type.String({ minLength: 2 }),
  username: Type.String({ minLength: 3 }),
  password: Type.String({ minLength: 4 }),
  email: Type.String({ format: "email" }),
  inviteKey: Type.String(),
});
export type UserType = Static<typeof UserSchema>;

export const SignUpResponseSchema = Type.Object({
  status: Type.String(),
  message: Type.String(),
  user: Type.Object({
    firstName: Type.String({ minLength: 2 }),
    lastName: Type.String({ minLength: 2 }),
    username: Type.String({ minLength: 3 }),
    email: Type.String({ format: "email" }),
  }),
});
export type SignUpResponseType = Static<typeof SignUpResponseSchema>;

export type SignUpType = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
};

export type UserPayload = {
  id: string;
  username: string;
  role: Role;
  createdAt?: Date;
};

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
