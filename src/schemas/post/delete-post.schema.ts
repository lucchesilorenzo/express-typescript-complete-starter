import { ValidatedRequest } from "express-zod-safe";
import z from "zod";

export const deletePostParamsSchema = z.object({
  postId: z.uuid({ error: "Post ID is required." }),
});

export type DeletePostRequest = ValidatedRequest<{
  params: typeof deletePostParamsSchema;
}>;
