import { FastifyInstance, RouteShorthandOptions } from "fastify";
import AuthService from "./authService";
import { Container } from "typedi";
import { Status } from "src/utils/Status";
import { TokenType, TokenSchema, ResponseSchema, ResponseType } from "@schema";
import { ApiError } from "@util/ApiError";

const authService = Container.get(AuthService);

const options: RouteShorthandOptions = {
  schema: {
    description: "Verify a user session corresponding to the provided refresh token",
    summary: "Verify session",
    tags: ["Authentication"],
    body: TokenSchema,
    response: {
      200: ResponseSchema,
    },
  },
};

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.post<{ Body: TokenType; Reply: ResponseType }>(
    "/verify-session",
    options,
    async (req, res) => {
      const refreshToken = req.cookies["refreshToken"] || req.body?.token;

      if (!refreshToken) throw new ApiError(400, "Bad Request");

      const tokenExists = await authService.checkRefreshToken(refreshToken);

      if (!tokenExists) throw new ApiError(401, "Session Expired");

      res.send({
        status: Status.SUCCESS,
        message: "session valid",
      });
    }
  );
}
