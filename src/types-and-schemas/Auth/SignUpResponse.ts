import { Role } from "@prisma/client";
import { Type, Static } from "@sinclair/typebox";

export const SignUpResponse = Type.Object({
  status: Type.String(),
  message: Type.String(),
  user: Type.Object({
    id: Type.Optional(Type.String()),
    role: Type.Optional(Type.Enum(Role)),
    firstName: Type.String({ minLength: 2 }),
    lastName: Type.String({ minLength: 2 }),
    username: Type.String({ minLength: 3 }),
    password: Type.Optional(Type.String({ minLength: 4 })),
    email: Type.String({ format: "email" }),
    inviteKey: Type.Optional(Type.String()),
  }),
});
