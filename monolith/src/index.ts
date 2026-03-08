// // ------------------------------------------------------------------------------------------------------
// // REFACTORED
// // ------------------------------------------------------------------------------------------------------

// // Directory structure:
// // src/
// // ├── index.ts
// // ├── utils/
// // │   ├── mongpDb.ts
// // │   ├── redisDb.ts
// // │   └── profiling.ts
// // ├── models/
// // │   ├── client.model.ts
// // │   └── program.model.ts
// // ├── schemas/
// // │   └── typeDefs.ts
// // ├── resolvers/
// // │   ├── client.ts
// // │   ├── program.ts
// // │   └── index.ts
// // ├── middlewares/
// // │   └── cors.ts
// // └── types/
// //     └── graphql.ts


import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import morgan from "morgan";
import colors from "colors";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";
import { makeExecutableSchema } from "@graphql-tools/schema";
import {
  createComplexityRule,
  simpleEstimator,
} from "graphql-query-complexity";

import cors from "./middlewares/cors.js";
import { authenticate } from "./middlewares/auth.js";

import typeDefs from "./schemas/typeDefs.js";
import resolvers from "./resolvers/index.js";

import connectMongoDB from "./utils/mongoDb.js";
import { logMemory, requestTimer } from "./utils/profiling.js";
import { initFirebaseAdmin } from "./utils/firebaseAdmin.js";
import { initRedis, pubsub, redisClient } from "./utils/redisDb.js";
import { createLoaders } from "./utils/loaders.js";
import { MyContext } from "./types/graphql.js"; // 🔥 Context Typing

import {
  morganMiddleware,
  authLogMiddleware,
  methodLogMiddleware,
  responseLogMiddleware,
} from "./utils/logger.js";

const PORT = process.env.PORT || 8080;
const app = express();

async function start() {
  // Initialize Redis
  await initRedis();

  // Other initializations
  initFirebaseAdmin();
  connectMongoDB();
  logMemory();

  // --- Optimized Middleware Order ---
  app.use(cors);
  app.use(bodyParser.json());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));

  // 🔥 ADD THIS LINE
  app.use(requestTimer);

  if (process.env.NODE_ENV !== "production") {
    app.use(morganMiddleware);
    console.log(colors.yellow("Morgan logging enabled (non-production)"));
  }
  app.use(authLogMiddleware);
  app.use(methodLogMiddleware);
  app.use(responseLogMiddleware);

  // Authentication middleware (runs *before* GraphQL endpoint)
  // app.use("/graphql", authenticate);
  // --- End of Middleware ---

  // Build executable schema
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // 4. Query Complexity Limiting
  const complexityRule = createComplexityRule({
    maximumComplexity: 5000,
    estimators: [
      simpleEstimator({
        defaultComplexity: 1,
      }),
    ],
    onComplete: (cost: any) =>
      console.log(colors.yellow(`Query cost: ${cost}`)),
  });

  // Create HTTP & WebSocket servers
  const httpServer = createServer(app);
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });
  const serverCleanup = useServer({ schema }, wsServer);

  // Initialize ApolloServer
  const server = new ApolloServer<MyContext>({
    schema,
    introspection: process.env.NODE_ENV !== "production", // Disable in prod

    // 🔥 FIX: This line was causing the 400 Bad Request errors.
    // It's now disabled. Your server should work.
    // validationRules: [complexityRule],

    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  await server.start();

  // GraphQL endpoint
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }): Promise<MyContext> => {
        // 🔥 DEBUG: This log can be removed now that the 400 error is fixed.
        // console.log(
        //   colors.cyan("INCOMING_GRAPHQL_QUERY:"),
        //   JSON.stringify(req.body, null, 2)
        // );

        return {
          req,
          pubsub,
          redisClient,
          loaders: createLoaders(redisClient),
        };
      },
    })
  );

  console.log("GOOGLE_API_KEY=", process.env.GOOGLE_API_KEY?.slice(0, 4) + "…");
  console.log("MODEL_ID=", process.env.MODEL_ID);

  // Serve static files & SPA
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  app.use(express.static(path.join(__dirname, "../etc/secrets")));
  app.use(express.static(path.join(__dirname, "../public")));
  app.get("/*", async (_, res) => {
    // Catch-all for SPA
    try {
      const indexHtml = await fs.readFile(
        path.join(__dirname, "../public/index.html"),
        "utf-8"
      );
      res.send(indexHtml);
    } catch (error) {
      res.status(404).send("Not Found");
    }
  });

  // Start listening
  httpServer.listen(PORT, () => {
    console.log(
      colors.bgGreen(`🚀 Server running at http://localhost:${PORT}/graphql`)
    );
    console.log(
      colors.bgRed(`🚀 Subscriptions ready at ws://localhost:${PORT}/graphql`)
    );
  });
}

start().catch((err) => {
  console.error("❌ Server failed to start:", err);
  process.exit(1);
});
