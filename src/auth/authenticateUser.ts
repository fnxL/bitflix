import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../../config/default";
import { ApiError } from "../utils/ApiError";
import { NewUser } from "../interfaces/User/NewUser";

const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const accessToken = authorization.split(" ")[1];
    console.log(accessToken);
    jwt.verify(accessToken, config.secret.access_token_secret!, (err, user) => {
      if (err) throw new ApiError(401, "Session Expired");
      req.user = user as NewUser;
      next();
    });
  } else {
    throw new ApiError(403, "Forbidden");
  }
};

export default authenticateUser;
