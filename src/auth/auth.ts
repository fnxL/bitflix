import { FastifyInstance, RouteShorthandOptions } from "fastify";
import AuthService from "./authService";
import { Container } from "typedi";
import { Status } from "@util/Status";
import { ApiError } from "@util/ApiError";
import { ResponseSchema } from "@schema";
import {
  LoginResponseSchema,
  LoginResponseType,
  LoginSchema,
  LoginType,
  SignUpResponseSchema,
  SignUpResponseType,
  TokenSchema,
  TokenType,
  UserSchema,
  UserType,
} from "./schema";

const authService = Container.get(AuthService);

const LoginOptions: RouteShorthandOptions = {
  schema: {
    description: "Login a user",
    summary: "Login",
    tags: ["Authentication"],
    body: LoginSchema,
    response: {
      200: LoginResponseSchema,
    },
  },
};

const SignUpOptions: RouteShorthandOptions = {
  schema: {
    description: "Register a user",
    summary: "Register",
    tags: ["Authentication"],
    body: UserSchema,
    response: {
      201: SignUpResponseSchema,
    },
  },
};

const LogoutOptions: RouteShorthandOptions = {
  schema: {
    description: "Logout a user",
    summary: "Logout",
    tags: ["Authentication"],
    body: TokenSchema,
    response: {
      200: ResponseSchema,
    },
  },
};

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.post<{ Body: UserType; Reply: SignUpResponseType }>(
    "/signup",
    SignUpOptions,
    async (req, res) => {
      const user = await authService.signUp(req.body);
      res
        .status(201)
        .send({ status: Status.SUCCESS, message: "Account created successfully!", user });
    }
  );

  fastify.post<{ Body: LoginType; Reply: LoginResponseType }>(
    "/login",
    LoginOptions,
    async (req, res) => {
      const { username, password } = req.body;

      const data = await authService.login(username, password);

      res.cookie("refreshToken", data.refreshToken);

      res.status(200).send({
        status: Status.SUCCESS,
        message: "Logged in successfully",
        ...data,
      });
    }
  );

  fastify.post<{ Body: TokenType }>("/logout", LogoutOptions, async (req, res) => {
    const refreshToken = req.cookies["refreshToken"] || req.body?.token;

    if (!refreshToken) throw new ApiError(401, "Unauthorized");

    await authService.deleteToken(refreshToken);

    res.cookie("refreshToken", "", {
      maxAge: 0,
      httpOnly: true,
    });

    res.send({
      status: Status.SUCCESS,
      message: "Logged out successfully!",
    });
  });
}
