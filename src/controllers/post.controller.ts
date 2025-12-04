import { CreatePostRequest } from "@/schemas/post/create-post.schema";
import { DeletePostRequest } from "@/schemas/post/delete-post.schema";
import { UpdatePostRequest } from "@/schemas/post/update-post.schema";
import {
  createNewPost,
  deletePostById,
  getAllPosts,
  updatePostById,
} from "@/services/post.service";
import { Request, Response } from "express";

export async function getPosts(req: Request, res: Response) {
  try {
    const posts = await getAllPosts();

    return res.status(200).json({ data: posts, success: true });
  } catch {
    return res
      .status(500)
      .json({ message: "Failed to get posts.", success: false });
  }
}

export async function createPost(req: CreatePostRequest, res: Response) {
  try {
    const post = await createNewPost(req);

    return res.status(201).json({
      data: post,
      message: "Post created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to create post.", success: false });
  }
}

export async function updatePost(req: UpdatePostRequest, res: Response) {
  try {
    const post = await updatePostById(req);

    return res.status(200).json({
      data: post,
      message: "Post updated successfully.",
      success: true,
    });
  } catch {
    return res
      .status(500)
      .json({ message: "Failed to update post.", success: false });
  }
}

export async function deletePost(req: DeletePostRequest, res: Response) {
  try {
    await deletePostById(req);

    return res.status(200).json({
      message: "Post deleted successfully.",
      success: true,
    });
  } catch {
    return res
      .status(500)
      .json({ message: "Failed to delete post.", success: false });
  }
}
