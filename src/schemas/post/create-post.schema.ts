import { ValidatedRequest } from "express-zod-safe";
import z from "zod";

export const createPostBodySchema = z.object({
  title: z.string({ error: "Title is required." }),
  content: z.string({ error: "Content is required." }),
  published: z.boolean().default(false),
});

export type CreatePostRequest = ValidatedRequest<{
  body: typeof createPostBodySchema;
}>;
