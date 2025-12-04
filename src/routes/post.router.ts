import {
  createPost,
  deletePost,
  getPosts,
  updatePost,
} from "@/controllers/post.controller";
import { createPostBodySchema } from "@/schemas/post/create-post.schema";
import { deletePostParamsSchema } from "@/schemas/post/delete-post.schema";
import {
  updatePostBodySchema,
  updatePostParamsSchema,
} from "@/schemas/post/update-post.schema";
import { Router } from "express";
import validate from "express-zod-safe";

const router = Router();

router.get("/", getPosts);
router.post("/", validate({ body: createPostBodySchema }), createPost);
router.put(
  "/:postId",
  validate({ params: updatePostParamsSchema, body: updatePostBodySchema }),
  updatePost
);
router.delete(
  "/:postId",
  validate({ params: deletePostParamsSchema }),
  deletePost
);

export default router;
