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
