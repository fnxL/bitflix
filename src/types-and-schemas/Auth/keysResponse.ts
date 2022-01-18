import { Type } from "@sinclair/typebox";

export const keysResponse = Type.Object({
  status: Type.String(),
  keys: Type.Array(
    Type.Object({
      inviteKey: Type.String(),
    })
  ),
});
