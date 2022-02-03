import { ResponseSchema, ResponseType } from "@schema";
import { ApiError } from "@util/ApiError";
import { FastifyInstance, RouteShorthandOptions } from "fastify";
import { Status } from "@util/Status";
import { Container } from "typedi";
import AdminService from "./adminService";
import {
  AppConfigResponseSchema,
  AppConfigResponseType,
  AppConfigSchema,
  AppConfigType,
} from "./schema";

const adminService = Container.get(AdminService);

const options: RouteShorthandOptions = {
  schema: {
    description:
      "Send in-app updates to the android client by updating this endpoint with new release data",
    summary: "Update app config",
    tags: ["Admin"],
    body: AppConfigSchema,
    response: {
      200: AppConfigResponseSchema,
    },
  },
};

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.post<{ Body: AppConfigType; Reply: AppConfigResponseType }>(
    "/app-config",
    options,
    async (req, res) => {
      const result = await adminService.updateAppConfig(req.body);

      return res.status(200).send({
        status: Status.SUCCESS,
        message: "App Config Updated Successfully",
        data: result,
      });
    }
  );
}
