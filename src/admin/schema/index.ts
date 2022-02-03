import { Type, Static, TSchema } from "@sinclair/typebox";
const Nullable = <T extends TSchema>(type: T) => Type.Union([type, Type.Null()]);

export const KeySchema = Type.Object({
  status: Type.String(),
  keys: Type.Array(
    Type.Object({
      inviteKey: Type.String(),
    })
  ),
});
export type KeyResponseType = Static<typeof KeySchema>;

export const GenerateKeySchema = Type.Object({
  count: Type.Number(),
});

export type GenerateKeyType = Static<typeof GenerateKeySchema>;

export const AppConfigSchema = Type.Object({
  latestVersion: Type.String(),
  latestVersionCode: Nullable(Type.Integer()),
  url: Type.String(),
  releaseNotes: Nullable(Type.String()),
});

export type AppConfigType = Static<typeof AppConfigSchema>;

export const AppConfigResponseSchema = Type.Object({
  status: Type.String(),
  message: Type.String(),
  data: Type.Object({
    appName: Type.String(),
    latestVersion: Type.String(),
    latestVersionCode: Nullable(Type.Integer()),
    url: Type.String(),
    releaseNotes: Nullable(Type.String()),
  }),
});

export type AppConfigResponseType = Static<typeof AppConfigResponseSchema>;
