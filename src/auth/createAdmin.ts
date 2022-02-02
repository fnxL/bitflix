import { ResponseSchema, ResponseType } from "@schema";
import { ApiError } from "@util/ApiError";
import { FastifyInstance, RouteShorthandOptions } from "fastify";
import { Status } from "@util/Status";
import { Container } from "typedi";
import AuthService from "./authService";

const authService = Container.get(AuthService);

const options: RouteShorthandOptions = {
  schema: {
    hide: true,
    response: {
      200: ResponseSchema,
    },
  },
};

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.get<{ Reply: ResponseType }>("/create-admin", options, async (req, res) => {
    const check = await authService.createAdmin();
    if (check) {
      return res.status(201).send({
        status: Status.SUCCESS,
        message: "Admin user created successfully",
      });
    }
    throw new ApiError(400, "Admin user already exists");
  });
}
