import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import env from "./lib/env";
import errorMiddleware from "./middlewares/errorMiddleware";
import notFoundMiddleware from "./middlewares/notFoundMiddleware";
import mainRouter from "./routes/mainRouter";

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(
  cors({
    origin: env.APP_ORIGIN,
  })
);
app.use(express.json());
app.use(express.urlencoded());

// Routes
app.use("/api", mainRouter);

// Error middlewares
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
