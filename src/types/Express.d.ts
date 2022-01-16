import { NewUser } from "../User/NewUser";

declare global {
  namespace Express {
    interface Request {
      user: NewUser;
    }
  }
}
