import { ResponseSchema } from "@schema";
import { FastifyInstance, RouteShorthandOptions } from "fastify";
import { Status } from "@util/Status";
import { Container } from "typedi";
import { GenerateKeySchema, GenerateKeyType, KeySchema } from "./schema";
import AdminService from "./adminService";

const adminService = Container.get(AdminService);

const GenerateOptions: RouteShorthandOptions = {
  schema: {
    description: "Generate an invite key which is requried while registering a new account",
    summary: "Generate invite key",
    tags: ["Admin"],
    body: GenerateKeySchema,
    response: {
      200: ResponseSchema,
    },
  },
};

const KeyOptions: RouteShorthandOptions = {
  schema: {
    description: "Get a list of all invite keys available.",
    summary: "Invite keys",
    tags: ["Admin"],
    response: {
      200: KeySchema,
    },
  },
};

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.post<{ Body: GenerateKeyType }>("/keys/generate", GenerateOptions, async (req, res) => {
    const { count } = req.body;

    const key = await adminService.generateKeys(count);
    res.status(201).send({
      status: Status.SUCCESS,
      message: "Invite key generated successfully",
      ...(key as {}),
    });
  });

  fastify.get("/keys", KeyOptions, async (req, res) => {
    const keys = await adminService.getInviteKeys();
    res.status(200).send({
      status: Status.SUCCESS,
      keys,
    });
  });
}
