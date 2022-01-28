import config from "@config";
import { ApiError } from "@util/ApiError";
import { FastifyInstance, RouteShorthandOptions } from "fastify";
import jwt from "jsonwebtoken";
import { Status } from "src/utils/Status";
import { Container } from "typedi";
import AuthService from "./authService";
import {
  TokenResponseSchema,
  TokenResponseType,
  TokenSchema,
  TokenType,
  UserPayload,
} from "./schema";

const authService = Container.get(AuthService);

const options: RouteShorthandOptions = {
  schema: {
    description: "Get a new accessToken using refreshToken",
    summary: "Generate accessToken",
    tags: ["Authentication"],
    body: TokenSchema,
    response: {
      200: TokenResponseSchema,
    },
  },
};

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.post<{ Body: TokenType; Reply: TokenResponseType }>(
    "/token",
    options,
    async (req, res) => {
      const refreshToken = req.cookies["refreshToken"] || req.body?.token;

      if (!refreshToken) throw new ApiError(400, "Bad Request");

      const tokenExists = await authService.checkRefreshToken(refreshToken);

      if (!tokenExists) throw new ApiError(401, "Unauthorized");
      jwt.verify(refreshToken, config.secret.refresh_token_secret!, (err, decoded) => {
        if (err) throw new ApiError(401, "Session Expired");
        const { id, username, role } = decoded as UserPayload;
        const accessToken = authService.generateAccessToken({
          id,
          username,
          role,
        });

        res.status(200).send({
          status: Status.SUCCESS,
          message: "Token generated successfully",
          accessToken,
        });
      });
    }
  );
}
