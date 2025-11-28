# Step-by-Step Guide to Setting Up Express with TypeScript (Complete Version)

## Prerequisites

- [Node.js](https://nodejs.org/en/)

## Step 1: Create a new project

First, create new project with the following command:

```bash
mkdir express-typescript-complete-starter
cd express-typescript-complete-starter
npm init -y
```

## Step 2: Install Dependencies

```bash
npm i express@^5.0.1 cors morgan @prisma/client helmet zod axios bcryptjs jsonwebtoken
npm i -D typescript ts-patch typescript-transform-paths ts-node eslint prisma @types/express @types/node @types/morgan @types/cors @eslint/js @types/bcryptjs @types/jsonwebtoken
npx prisma init --datasource-provider sqlite
npx prisma db push
npx prisma generate
```

## Step 3: Configure TypeScript

To initialize TypeScript, run this command:

```bash
npx tsc --init
```

Then, update the **tsconfig.json** file with the following content:

```json
{
  "ts-node": {
    "transpileOnly": true,
    "require": ["typescript-transform-paths/register"]
  },
  "compilerOptions": {
    "target": "ESNext",
    "module": "commonjs",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "skipLibCheck": true,
    "baseUrl": "./",
    "paths": {
      "@/*": ["./src/*"]
    },
    "plugins": [
      { "transform": "typescript-transform-paths" },
      { "transform": "typescript-transform-paths", "afterDeclarations": true }
    ]
  }
}
```

## Step 4: ESLint Config

Create an **eslint.config.mjs** file at the root of the project with the following content:

```ts
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
];
```

## Step 5: Update package.json scripts

```json
  "scripts": {
    "build": "tsc --build",
    "start": "node ./dist/server.js",
    "dev": "node -r ts-node/register --watch --env-file=.env ./src/server.ts",
    "format": "prettier --write .",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  },
```

## Step 6: Create a .env file

In the **.env** file add the following content:

```bash
DATABASE_URL="file:./dev.db"
APP_ORIGIN=http://localhost:5173 # The URL of your frontend app
API_URL=http://localhost:3000 # The URL of your Express app
PORT=3000 # The port your Express app is running on
NODE_ENV=development # Set to "production" in a production environment
JWT_SECRET="your-secret" # You can generate one with `openssl rand -base64 32`
```

## Step 7: Create env.ts file

Create a new file named **src/lib/env.ts** with the following code:

```ts
import { z } from "zod";

const envSchema = z.object({
  APP_ORIGIN: z.string().url(),
  API_URL: z.string().url(),
  PORT: z.coerce.number().min(3000).max(5000),
  NODE_ENV: z
    .union([z.literal("development"), z.literal("production")])
    .default("development"),
  JWT_SECRET: z.string(),
});

const env = envSchema.parse(process.env);

export default env;
```

## Step 8: Instantiate a Prisma client

Create a new file named **src/lib/prisma.ts** with the following code:

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
```

## Step 9: Create errorMiddleware.ts file

Create a new file named **src/middlewares/errorMiddleware.ts** with the following code:

```ts
import { Request, Response, NextFunction } from "express";
import env from "../lib/env";

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any*/
export default function errorMiddleware(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(error.status || 500).json({
    error: "Internal Server Error",
    message:
      env.NODE_ENV === "development"
        ? error.stack
        : "An unexpected error occurred.",
  });
}
```

## Step 10: Create notFoundMiddleware.ts file

Create a new file named **src/middlewares/notFoundMiddleware.ts** with the following code:

```ts
import { Request, Response, NextFunction } from "express";

/* eslint-disable @typescript-eslint/no-unused-vars */
export default function notFoundMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(404).json({
    error: "Not Found",
    message: `The requested resource '${req.originalUrl}' was not found on this server.`,
  });
}
```

## Step 11: Create authMiddleware.ts file

Create a new file named **src/middlewares/authMiddleware.ts** with the following code:

```ts
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import env from "../lib/env";

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(token, env.JWT_SECRET, (error, decoded) => {
    if (error) {
      res.sendStatus(403);
      return;
    }

    if (decoded && typeof decoded === "object") {
      req.userId = decoded.id;
      next();
    }
  });
}
```

## Step 12: Create index.d.ts file

Create a new file named **src/index.d.ts** with the following code:

```ts
declare namespace Express {
  export interface Request {
    userId?: string;
  }
}
```

## Step 13: Add a User model to the Prisma schema

Add the following model to the **prisma/schema.prisma** file:

```ts
model User {
  id        String    @id @default(cuid())
  username  String    @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Then, run the following command to push the changes to the database:

```bash
npx prisma db push
```

## Step 14: Create a mainRouter.ts file

Create a new file named **src/routes/mainRouter.ts** with the following code:

```ts
import { Router } from "express";
import postsRouter from "./postsRouter";
import authMiddleware from "@/middlewares/authMiddleware";

const router = Router();

router.use("/posts", authMiddleware, postsRouter); // Protected route

export default router;
```

## Step 15: Create a postsRouter.ts file

Create a new file named **src/routes/postsRouter.ts** with the following code:

```ts
import { Router } from "express";
import { getPosts } from "@/controllers/postsController";

const router = Router();

router.get("/", getPosts);

export default router;
```

## Step 16: Create a postsController.ts file

Create a new file named **src/controllers/postsController.ts** with the following code:

```ts
import { Request, Response } from "express";

export async function getPosts(req: Request, res: Response) {
  try {
    res.status(200).json({ id: 1, title: "My first post" });
  } catch {
    res.status(500).json({ message: "Failed to get posts." });
  }
}
```

## Step 17: Create a app.ts file

Create a new file named **src/app.ts** with the following code:

```ts
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
```

## Step 18: Create a server.ts file

Create a new file named **src/server.ts** with the following code:

```ts
import app from "./app";
import env from "./lib/env";

const PORT = env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
```

## Step 19: Run your application

Run the following command to run your application:

```bash
npm run dev
```

Server will be running on `http://localhost:3000`.

## Final project structure

```css
express-typescript-complete-starter
├── src
│   ├── routes
│   │   ├── mainRouter.ts
│   │   └── postsRouter.ts
│   ├── controllers
│   │   └── postsController.ts
│   ├── middlewares
│   │   ├── authMiddleware.ts
│   │   └── errorMiddleware.ts
│   │   └── notFoundMiddleware.ts
│   ├── lib
│   │   ├── env.ts
│   │   ├── prisma.ts
│   ├── app.ts
│   ├── index.d.ts
│   └── server.ts
├── prisma
|   ├── dev.db
|   └── schema.prisma
├── uploads
├── .env
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── package-lock.json
├── package.json
└── tsconfig.json
```
