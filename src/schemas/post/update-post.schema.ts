import { ValidatedRequest } from "express-zod-safe";
import z from "zod";

export const updatePostParamsSchema = z.object({
  postId: z.uuid({ error: "Post ID is required." }),
});

export const updatePostBodySchema = z.object({
  title: z.string({ error: "Title is required." }),
  content: z.string({ error: "Content is required." }),
  published: z.boolean().default(false),
});

export type UpdatePostRequest = ValidatedRequest<{
  params: typeof updatePostParamsSchema;
  body: typeof updatePostBodySchema;
}>;
