import { Prisma, PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { FastifyLoggerInstance } from "fastify";
import jwt from "jsonwebtoken";
import { Inject, Service } from "typedi";
import config from "@config";
import { UserType, SignUpType, UserPayload } from "./schema/SignUp";
import { ApiError } from "../utils/ApiError";
import { hash } from "src/utils/utils";

@Service()
class AuthService {
  constructor(
    @Inject("logger") private logger: FastifyLoggerInstance,
    @Inject("prisma") private prisma: PrismaClient
  ) {
    logger.info("AuthService Initialized...");
  }

  async getInviteKeys(): Promise<Prisma.Key[]> {
    this.logger.info("Getting all invite keys...");
    const keys = await this.prisma.key.findMany();
    return keys;
  }

  async generateKey() {
    this.logger.info("Generating one time invite key...");
    const key = await this.prisma.key.create({
      data: {},
    });
    return key;
  }

  async signUp({ inviteKey, password, ...rest }: UserType): Promise<SignUpType> {
    this.logger.info("Checking if inviteKey is valid");
    const getInviteKey = await this.prisma.key.findUnique({
      where: {
        inviteKey,
      },
    });

    if (!getInviteKey) throw new ApiError(406, "Invalid Invite Key");

    this.logger.info("Checking if user already exists");
    const checkUser = await this.getUser(rest.username);

    if (checkUser) throw new ApiError(400, "User with this username already exists");

    this.logger.info("Hashing Password");
    const hashedPassword = await hash(password);

    this.logger.info("Creating DB record...");

    const user = await this.prisma.user.create({
      select: {
        firstName: true,
        lastName: true,
        username: true,
        email: true,
      },
      data: {
        ...rest,
        password: hashedPassword,
      },
    });

    if (!user) {
      throw new ApiError(400, "User cannot be created");
    }

    this.logger.info("User created successfully");

    this.logger.info("Deleting invitekey");

    await this.prisma.key.delete({
      where: {
        inviteKey,
      },
    });

    return { ...user };
  }

  async createAdmin() {
    const checkAdmin = await this.getUser("admin");
    if (checkAdmin) {
      this.logger.info("Admin Already Exists");
      return false;
    }

    this.logger.info("Hashing Password");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(config.admin.password!, salt);

    const admin = {
      firstName: "Site",
      lastName: "Admin",
      email: "admin@admin.com",
      username: config.admin.username!,
      password: hashedPassword,
      role: Role.ADMIN,
    };

    await this.prisma.user.create({
      data: admin,
    });
    this.logger.info("Admin User created successfully");
    return true;
  }

  async login(username: string, password: string) {
    this.logger.info("Checking if user exists");
    const checkUser = await this.getUser(username);
    if (!checkUser) throw new ApiError(401, "Invalid credentials, please try again!");

    this.logger.info("Checking Password");
    const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);

    if (checkPasswordMatch) {
      this.logger.info("Password is valid!");
      this.logger.info("Generating JWT");
      const { password: userpass, ...user } = checkUser;

      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      await this.prisma.session.create({
        data: {
          refreshToken,
          user_id: user.id,
        },
      });

      return { user, accessToken, refreshToken };
    }
    throw new ApiError(401, "Invalid credentials, please try again!");
  }

  async checkRefreshToken(token: string) {
    const refreshToken = await this.prisma.session.findUnique({
      where: {
        refreshToken: token,
      },
    });
    return refreshToken ? true : false;
  }

  async deleteToken(token: string) {
    await this.prisma.session.delete({
      where: {
        refreshToken: token,
      },
    });
  }

  generateRefreshToken(user: UserPayload) {
    return jwt.sign(user, config.secret.refresh_token_secret!);
  }

  generateAccessToken(user: UserPayload) {
    this.logger.info(`Signing JWT for user: ${user.username}`);
    return jwt.sign(user, config.secret.access_token_secret!, {
      expiresIn: config.secret.expires,
    });
  }

  /* Verify JWT */
  async verify(token: string) {
    this.logger.info("Verifying user...");
    const check = jwt.verify(token, config.secret.access_token_secret!);

    if (!check) throw new ApiError(406, "invalid_token");

    const user = await this.getUser(check.username);

    if (user) return true;
    return false;
  }

  /* Get A User */
  async getUser(username: string) {
    const user = await this.prisma.user.findUnique({
      select: {
        id: true,
        username: true,
        password: true,
        role: true,
        createdAt: true,
      },
      where: {
        username,
      },
    });
    return user;
  }
}

export default AuthService;
