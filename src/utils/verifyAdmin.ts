import { Role } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import config from "../../config/default";
import { UserType } from "../types-and-schemas";
import { ApiError } from "./ApiError";

const verifyAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
  const authorization = request.headers.authorization;
  if (authorization) {
    const accessToken = authorization.split(" ")[1];
    jwt.verify(accessToken, config.secret.access_token_secret!, (err, decoded) => {
      if (err) throw new ApiError(401, "Session Expired");
      const user = decoded as UserType;
      if (user.role != Role.ADMIN) {
        throw new ApiError(403, "Forbidden");
      }
    });
  } else {
    throw new ApiError(401, "Unauthorized");
  }
};

export default verifyAdmin;
