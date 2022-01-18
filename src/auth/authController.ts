import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import "reflect-metadata";
import { Container } from "typedi";
import config from "../../config/default";
import {
  LoginFastifyRequest,
  LogoutRequestType,
  SignUpFastifyRequest,
  UserType,
} from "../types-and-schemas";
import { ApiError } from "../utils/ApiError";
import { Status } from "../utils/Status";
import AuthService from "./authService";

const authService = Container.get(AuthService);

export const signUp = async (request: SignUpFastifyRequest, reply: FastifyReply) => {
  const user = await authService.signUp(request.body);
  reply
    .status(201)
    .send({ status: Status.SUCCESS, message: "Account registered successfully!", user });
};

export const login = async (request: LoginFastifyRequest, reply: FastifyReply) => {
  const { username, password } = request.body;

  const data = await authService.login(username, password);
  reply.cookie("refreshToken", data.refreshToken);
  reply.status(200).send({
    status: Status.SUCCESS,
    message: "Logged in successfully!",
    ...data,
  });
};

export const logout = async (
  request: FastifyRequest<{ Body: LogoutRequestType }>,
  reply: FastifyReply
) => {
  const refreshToken = request.cookies["refreshToken"] || request.body?.token;
  if (refreshToken) {
    await authService.deleteToken(refreshToken);

    reply.cookie("refreshToken", "", {
      maxAge: 0,
      httpOnly: true,
    });

    reply.send({
      status: Status.SUCCESS,
      message: "Logged out successfully!",
    });
  } else {
    throw new ApiError(401, "Unauthorized");
  }
};

export const getToken = async (
  request: FastifyRequest<{ Body: LogoutRequestType }>,
  reply: FastifyReply
) => {
  const refreshToken = request.cookies["refreshToken"] || request.body?.token;

  if (refreshToken) {
    const tokenExists = await authService.checkRefreshToken(refreshToken);
    if (tokenExists) {
      jwt.verify(refreshToken, config.secret.refresh_token_secret!, (err, decoded) => {
        if (err) throw new ApiError(401, "Session Expired");
        const user = decoded as UserType;
        const accessToken = authService.generateAccessToken({
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          role: user.role,
        } as UserType);

        reply.status(200).send({
          status: Status.SUCCESS,
          accessToken,
        });
      });
    } else {
      throw new ApiError(401, "Unauthorized");
    }
  } else {
    throw new ApiError(401, "Unauthorized");
  }
};

export const generateKey = async (request: FastifyRequest, reply: FastifyReply) => {
  const key = await authService.generateKey();

  reply.status(201).send({
    status: Status.SUCCESS,
    message: "Invite key generated successfully",
    ...(key as {}),
  });
};

export const getKeys = async (request: FastifyRequest, reply: FastifyReply) => {
  const keys = await authService.getInviteKeys();
  reply.status(200).send({
    status: Status.SUCCESS,
    keys,
  });
};

export const createAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
  const check = await authService.createAdmin();
  if (check) {
    return reply.status(201).send({
      status: Status.SUCCESS,
      message: "Admin user created successfully",
    });
  }
  throw new ApiError(400, "Admin user already exists");
};
