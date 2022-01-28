import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import config from "@config";
import { ApiError } from "./ApiError";
import { Container } from "typedi";
import AuthService from "../auth/authService";
import { UserPayload } from "src/auth/schema";

const authService = Container.get(AuthService);

const verifyUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const authorization = request.headers.authorization;
  const refreshToken = request.cookies["refreshToken"] || request.headers["x-refresh-token"];

  if (!refreshToken) throw new ApiError(401, "Session not found");

  if (!authorization) throw new ApiError(401, "Unauthorized");

  const tokenExists = await authService.checkRefreshToken(refreshToken as string);

  if (!tokenExists) throw new ApiError(401, "Session Expired");

  const accessToken = authorization.split(" ")[1];
  jwt.verify(accessToken, config.secret.access_token_secret!, (err, user) => {
    if (err) throw new ApiError(401, "Session Expired");
    request.user = user as UserPayload;
  });
};

export default verifyUser;
