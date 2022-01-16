import { Role } from "@prisma/client";

export interface NewUser {
  id?: string;
  role?: Role;
  firstName: string;
  lastName: string;
  username: string;
  password?: string;
  email: string;
  inviteKey?: string;
}
