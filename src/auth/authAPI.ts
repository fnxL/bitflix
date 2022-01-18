import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
  keysResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  Response,
  SignUpResponse,
  User,
} from "../types-and-schemas";
import { routeOptions } from "../utils/utils";
import {
  createAdmin,
  generateKey,
  getKeys,
  getToken,
  login,
  logout,
  signUp,
} from "./authController";

async function authRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  /** Create a new account */
  fastify.post("/signup", routeOptions(SignUpResponse, 201, User), signUp);

  /* Login */
  fastify.post("/login", routeOptions(LoginResponse, 200, LoginRequest), login);

  /* Logout */
  fastify.post("/logout", routeOptions(Response, 200, LogoutRequest), logout);

  /** Get accessToken */
  fastify.post("/token", routeOptions(Response, 200, LogoutRequest), getToken);

  /* Generate an Invite key */
  fastify.get("/keys/generate", routeOptions(Response, 201), generateKey);

  /* Get All Keys */
  fastify.get(
    "/keys",
    routeOptions(keysResponse, 200, null, fastify.auth([fastify.verifyAdmin])),
    getKeys
  );

  /* Create admin user */
  fastify.get("/create-admin", routeOptions(Response, 201), createAdmin);
}

export default authRoutes;
