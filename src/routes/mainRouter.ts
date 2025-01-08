import { Router } from "express";
import postsRouter from "./postsRouter";
import authMiddleware from "@/middlewares/authMiddleware";

const router = Router();

router.use("/posts", authMiddleware, postsRouter);

export default router;
