import { FastifyReply, FastifyRequest, DoneFuncWithErrOrRes } from "fastify";
import jwt from "jsonwebtoken";
import config from "../../config/default";
import { UserType } from "../types-and-schemas";
import { ApiError } from "./ApiError";

const verifyUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const authorization = request.headers.authorization;
  if (authorization) {
    const accessToken = authorization.split(" ")[1];
    jwt.verify(accessToken, config.secret.access_token_secret!, (err, user) => {
      if (err) throw new ApiError(401, "Session Expired");
      request.user = user as UserType;
    });
  } else {
    throw new ApiError(401, "Unauthorized");
  }
};

export default verifyUser;
