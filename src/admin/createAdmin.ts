import { ResponseSchema, ResponseType } from "@schema";
import { ApiError } from "@util/ApiError";
import { FastifyInstance, RouteShorthandOptions } from "fastify";
import { Status } from "@util/Status";
import { Container } from "typedi";
import AdminService from "./adminService";

const adminService = Container.get(AdminService);

const options: RouteShorthandOptions = {
  schema: {
    tags: ["Admin"],
    response: {
      200: ResponseSchema,
    },
  },
};

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.get<{ Reply: ResponseType }>("/create", options, async (req, res) => {
    const check = await adminService.createAdmin();
    if (check) {
      return res.status(201).send({
        status: Status.SUCCESS,
        message: "Admin user created successfully",
      });
    }
    throw new ApiError(400, "Admin user already exists");
  });
}
