import { z } from "zod";

const joinRoomSchema = z.object({
  name: z.string(),
  roomID: z.string(),
  github: z.string(),
});

export type JoinRoomSchemaType = z.infer<typeof joinRoomSchema>;

export default joinRoomSchema;
