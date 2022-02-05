import { Prisma, PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { FastifyLoggerInstance } from "fastify";
import { Inject, Service } from "typedi";
import config from "@config";
import { ApiError } from "../utils/ApiError";

@Service()
class AdminService {
  constructor(
    @Inject("prisma") private prisma: PrismaClient,
    @Inject("logger") private logger: FastifyLoggerInstance
  ) {
    logger.info("Admin Service initialized...");
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

  async getInviteKeys(): Promise<Prisma.Key[]> {
    this.logger.info("Getting all invite keys...");
    const keys = await this.prisma.key.findMany();
    return keys;
  }

  async generateKeys(numberOfKeys: number) {
    if (!numberOfKeys) throw new ApiError(400, "Bad Request");

    this.logger.info("Generating one time invite keys...");

    const data: Prisma.KeyCreateInput[] = Array.from({ length: numberOfKeys }).map(() => ({}));
    const keys = await this.prisma.key.createMany({
      data,
    });
    return keys;
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

export default AdminService;
