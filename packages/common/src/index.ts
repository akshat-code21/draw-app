import z from "zod";
export const createUserSchema = z.object({
  username: z.string(),
  password: z.string().min(8).max(10),
  name: z.string(),
});
export const signinSchema = z.object({
  username: z.string(),
  password: z.string().min(8).max(10),
});
export const createRoomSchema = z.object({
    name : z.string().min(3).max(20)
})
