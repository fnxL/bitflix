import { Role } from "@prisma/client";

export interface StrippedUserData {
  id: String;
  role: Role;
  username: String;
  createdAt?: Date;
}
