import "reflect-metadata";
import { Request, Response } from "express";
import { Container } from "typedi";
import { NewUser } from "../interfaces/User/NewUser";
import { ApiError } from "../utils/ApiError";
import AuthService from "./authService";
import jwt from "jsonwebtoken";
import config from "../../config/default";
import { Status } from "../utils/Status";

const authService = Container.get(AuthService);

export const signUp = async (req: Request, res: Response) => {
  const user = await authService.signUp(req.body as NewUser);
  res
    .status(201)
    .json({ user, status: Status.SUCCESS, message: "Account registered successfully!" });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const data = await authService.login(username, password);

  res.cookie("refreshToken", data.refreshToken, {
    sameSite: "none",
    httpOnly: true,
    secure: false,
  });

  res.status(200).json({
    status: Status.SUCCESS,
    message: "Logged in successfully!",
    ...data,
  });
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies["refreshToken"] as string;
  if (refreshToken) {
    await authService.deleteToken(refreshToken);
    res.cookie("refreshToken", "", {
      maxAge: 0,
      httpOnly: true,
    });
    res.json({
      status: Status.SUCCESS,
      message: "Logged out successfully!",
    });
  } else {
    throw new ApiError(403, "Forbidden");
  }
};

export const token = async (req: Request, res: Response) => {
  const refreshToken = req.cookies["refreshToken"] as string;
  if (refreshToken) {
    const tokenExists = await authService.checkRefreshToken(refreshToken);
    if (tokenExists) {
      jwt.verify(refreshToken, config.secret.refresh_token_secret!, (err, user) => {
        if (err) throw new ApiError(403, "Forbidden");

        const accessToken = authService.generateAccessToken(user as NewUser);

        res.json({
          status: Status.SUCCESS,
          accessToken,
        });
      });
    }
  } else {
    throw new ApiError(403, "Forbidden");
  }
};

export const generateKey = async (req: Request, res: Response) => {
  const key = await authService.generateKey();
  res.status(201).json({
    status: Status.SUCCESS,
    message: "Invite key generated successfully!",
    ...(key as {}),
  });
};

export const getKeys = async (req: Request, res: Response) => {
  const keys = await authService.getInviteKeys();
  res.status(200).json({
    status: Status.SUCCESS,
    keys,
  });
};

export const createAdmin = async (req: Request, res: Response) => {
  const check = await authService.createAdmin();
  if (check) {
    return res.status(201).json({
      status: Status.SUCCESS,
      message: "Admin user created successfully",
    });
  }
  throw new ApiError(400, "Admin user already exists");
};
