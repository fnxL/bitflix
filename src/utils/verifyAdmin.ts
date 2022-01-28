import { Role } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import config from "@config";
import { ApiError } from "./ApiError";
import { UserPayload } from "src/auth/schema";

const verifyAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
  const authorization = request.headers.authorization;

  if (!authorization) throw new ApiError(401, "Unauthorized");

  const accessToken = authorization.split(" ")[1];
  jwt.verify(accessToken, config.secret.access_token_secret!, (err, decoded) => {
    if (err) throw new ApiError(401, "Session Expired");
    const user = decoded as UserPayload;
    if (user.role != Role.ADMIN) {
      throw new ApiError(403, "Forbidden");
    }
  });
};

export default verifyAdmin;
