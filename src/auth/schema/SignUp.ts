import { Role } from "@prisma/client";
import { Type, Static } from "@sinclair/typebox";

export const UserSchema = Type.Object({
  firstName: Type.String({ minLength: 2 }),
  lastName: Type.String({ minLength: 2 }),
  username: Type.String({ minLength: 3 }),
  password: Type.String({ minLength: 4 }),
  email: Type.String({ format: "email" }),
  inviteKey: Type.String(),
});

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

export type UserType = Static<typeof UserSchema>;

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
