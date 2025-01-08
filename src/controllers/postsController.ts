import { Request, Response } from "express";

export async function getPosts(req: Request, res: Response) {
  try {
    res.status(200).json({ id: 1, title: "My first post" });
  } catch {
    res.status(500).json({ message: "Failed to get posts." });
  }
}
