import { Static, Type } from "@sinclair/typebox";

export const KeySchema = Type.Object({
  status: Type.String(),
  keys: Type.Array(
    Type.Object({
      inviteKey: Type.String(),
    })
  ),
});

export type KeyResponseType = Static<typeof KeySchema>;
