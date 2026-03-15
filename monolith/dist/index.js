// ------------------------------------------------------------------------------------------------------
// REFACTORED
// ------------------------------------------------------------------------------------------------------
// Directory structure:
// src/
// ├── index.ts
// ├── utils/
// │   ├── mongpDb.ts
// │   ├── redisDb.ts
// │   └── profiling.ts
// ├── models/
// │   ├── client.model.ts
// │   └── program.model.ts
// ├── schemas/
// │   └── typeDefs.ts
// ├── resolvers/
// │   ├── client.ts
// │   ├── program.ts
// │   └── index.ts
// ├── middlewares/
// │   └── cors.ts
// └── types/
//     └── graphql.ts
import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import colors from "colors";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";
import { makeExecutableSchema } from "@graphql-tools/schema";
import cors from "./middlewares/cors.js";
import typeDefs from "./schemas/typeDefs.js";
import resolvers from "./resolvers/index.js";
import connectMongoDB from "./utils/mongoDb.js";
import logMemory from "./utils/profiling.js";
import { initFirebaseAdmin } from "./utils/firebaseAdmin.js";
import { initRedis, pubsub, redisClient } from "./utils/redisDb.js";
import { morganMiddleware, authLogMiddleware, methodLogMiddleware, responseLogMiddleware, } from "./utils/logger.js";
import paypalRouter from "./routes/paypal.js";
import chatRouter from "./routes/chat.js";
import transcribeRouter from "./routes/transcribe.js";
import synthesizeRouter from "./routes/synthesize.js";
const PORT = process.env.PORT || 4000;
const app = express();
async function start() {
    // Initialize Redis
    await initRedis();
    // Other initializations
    initFirebaseAdmin();
    connectMongoDB();
    logMemory();
    // Logging
    app.use(morganMiddleware);
    app.use(authLogMiddleware);
    app.use(methodLogMiddleware);
    app.use(responseLogMiddleware);
    // CORS & body parser
    app.use(cors);
    app.use(bodyParser.json());
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ limit: "10mb", extended: true }));
    // // Authentication Middleware
    // app.use("/graphql", authenticate);
    // Build executable schema
    const schema = makeExecutableSchema({ typeDefs, resolvers });
    // Create HTTP & WebSocket servers
    const httpServer = createServer(app);
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: "/graphql",
    });
    const serverCleanup = useServer({ schema }, wsServer);
    // Initialize ApolloServer
    const server = new ApolloServer({
        schema,
        introspection: true,
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
    app.use("/graphql", expressMiddleware(server, {
        context: async ({ req }) => ({
            req,
            pubsub,
            redisClient,
        }),
    }));
    console.log('GOOGLE_API_KEY=', process.env.GOOGLE_API_KEY?.slice(0, 4) + '…');
    console.log('MODEL_ID=', process.env.MODEL_ID);
    // — PayPal webhook route
    app.use("/paypal/webhook", paypalRouter);
    app.use("/api/chat", chatRouter);
    app.use("/api/transcribe", transcribeRouter);
    app.use("/api/synthesize", synthesizeRouter);
    // Serve static files & SPA
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    app.use(express.static(path.join(__dirname, "../etc/secrets")));
    app.use(express.static(path.join(__dirname, "../public")));
    app.get("/", async (_, res) => {
        const indexHtml = await fs.readFile(path.join(__dirname, "../public/index.html"), "utf-8");
        res.send(indexHtml);
    });
    // Start listening
    httpServer.listen(PORT, () => {
        console.log(colors.bgGreen(`🚀 Server running at http://localhost:${PORT}/graphql`));
        console.log(colors.bgRed(`🚀 Subscriptions ready at ws://localhost:${PORT}/graphql`));
    });
}
start().catch((err) => {
    console.error("❌ Server failed to start:", err);
    process.exit(1);
});
