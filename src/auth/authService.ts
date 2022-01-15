import { Prisma, PrismaClient, Role } from "@prisma/client";
import pino from "pino";
import { Service, Inject } from "typedi";
import { NewUser } from "../interfaces/User/NewUser";
import { ApiError } from "../utils/ApiError";
import config from "../../config/default";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

@Service()
class AuthService {
  constructor(
    @Inject("logger") private logger: pino.Logger,
    @Inject("prisma") private prisma: PrismaClient
  ) {
    logger.info("AuthService Initialized...");
  }

  /* 
    Get list of invite keys
  */
  async getInviteKeys(): Promise<Prisma.Key[]> {
    this.logger.info("Getting all invite keys...");
    const keys = await this.prisma.key.findMany();
    return keys;
  }

  /* Generate an invite key */
  async generateKey() {
    this.logger.info("Generating one time invite key...");
    const key = await this.prisma.key.create({
      data: {},
    });
    return key;
  }

  /* Sign Up a user */
  async signUp({ inviteKey, password, ...rest }: NewUser): Promise<NewUser> {
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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password!, salt);

    this.logger.info("Creating DB record");

    const user = await this.prisma.user.create({
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

    const { password: p1, ...userObject } = user;
    return { ...userObject };
  }

  /* Generate Admin User if not exists */

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
    const user = await this.getUser(username);
    if (!user) throw new ApiError(401, "Invalid Credentials");

    this.logger.info("Checking Password");
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      this.logger.info("Password is valid!");
      this.logger.info("Generating JWT");
      const { password: userpass, ...userData } = user;
      const accessToken = this.generateAccessToken(userData);
      const refreshToken = this.generateRefreshToken(userData);
      // store refreshToken into the database.
      await this.prisma.refreshToken.create({
        data: {
          token: refreshToken,
        },
      });

      return { userData, accessToken, refreshToken };
    }
    throw new ApiError(401, "Invalid Credentials");
  }

  async checkRefreshToken(token: string) {
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: {
        token,
      },
    });
    return refreshToken ? true : false;
  }

  async deleteToken(token: string) {
    await this.prisma.refreshToken.delete({
      where: {
        token,
      },
    });
  }

  generateRefreshToken(userData: NewUser) {
    return jwt.sign(userData, config.secret.refresh_token_secret!);
  }

  generateAccessToken(userData: NewUser) {
    this.logger.info(`Signing JWT for user: ${userData.username}`);
    return jwt.sign({ ...userData }, config.secret.access_token_secret!, { expiresIn: "5s" });
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
      where: {
        username,
      },
    });
    return user;
  }
}

export default AuthService;
