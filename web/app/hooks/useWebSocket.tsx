import { useEffect, useRef, useState } from "react";

export function useWebSocket(url: string) {
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<string[]>([]);
    const connectionRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const connectWebSocket = () => {
            const socket = new WebSocket(url);

            socket.onopen = () => {
                console.log("WebSocket connected");
                setIsConnected(true);
            };

            socket.onmessage = (event) => {
                console.log("Received message:", event.data);
                setMessages((prev) => [...prev, event.data]);
            };

            socket.onclose = () => {
                console.log("WebSocket disconnected");
                setIsConnected(false);
                setTimeout(connectWebSocket, 4000); // Retry after 2 seconds
            };

            socket.onerror = (error) => {
                console.error("WebSocket error:", error);
            };

            connectionRef.current = socket;
        };

        connectWebSocket();

        return () => connectionRef.current?.close();
    }, [url]);

    const sendMessage = (message: string) => {
        if (connectionRef.current?.readyState === WebSocket.OPEN) {
            connectionRef.current.send(message);
        }
    };

    return { isConnected, messages, sendMessage };
}
