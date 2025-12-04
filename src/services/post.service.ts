import { prisma } from "@/lib/prisma";
import { CreatePostRequest } from "@/schemas/post/create-post.schema";
import { DeletePostRequest } from "@/schemas/post/delete-post.schema";
import { UpdatePostRequest } from "@/schemas/post/update-post.schema";

export async function getAllPosts() {
  const posts = await prisma.post.findMany();

  return posts;
}

export async function createNewPost(data: CreatePostRequest) {
  const post = await prisma.post.create({
    data: { ...data.body, userId: "1" },
  });

  return post;
}

export async function updatePostById(data: UpdatePostRequest) {
  const post = await prisma.post.update({
    where: { id: data.params.postId },
    data: data.body,
  });

  return post;
}

export async function deletePostById(data: DeletePostRequest) {
  await prisma.post.delete({
    where: { id: data.params.postId },
  });
}
