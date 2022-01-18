import { FastifyRequest } from "fastify";

type PlayParams = {
  name: string;
};

type PlayQueryString = {
  id: string;
};

export type PlayFastifyRequest = FastifyRequest<{
  Params: PlayParams;
  Querystring: PlayQueryString;
}>;
