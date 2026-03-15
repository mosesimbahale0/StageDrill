// websocketClient.ts
import { createClient, Client } from "graphql-ws";

// Initialize the WebSocket client
let wsClient: Client;

export function initializeWebSocketClient() {
  if (typeof window !== "undefined") {
    wsClient = createClient({
      url: "ws://localhost:4000/graphql",
    });
  } else {
    (async () => {
      const WebSocket = (await import("ws")).default;
      wsClient = createClient({
        url: "ws://localhost:4000/graphql",
        webSocketImpl: WebSocket,
      });
    })();
  }
  return wsClient;
}
