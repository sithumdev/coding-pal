import { z } from "zod";

const createRoomSchema = z.object({
  owner: z.string(),
  language: z.string(),
  name: z.string(),
  socketID: z.string(),
  github: z.string(),
});

export type CreateRoomSchemaType = z.infer<typeof createRoomSchema>;

export default createRoomSchema;
