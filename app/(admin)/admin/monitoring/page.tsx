// In your Next.js app: app/docker-logs/page.tsx
"use client"; // Required for App Router

import React, { useState, useEffect, useRef, JSX } from "react";

export default function DockerLogsPage(): JSX.Element {
  // State for storing log messages, typed as an array of strings.
  const [logs, setLogs] = useState<string[]>([]);

  // Ref for the log container div element, properly typed.
  const logContainerRef = useRef<HTMLDivElement | null>(null);

  // The URL for your WebSocket server.
  // In a real app, you might get this from an environment variable.
  const wsUrl = `ws://13.201.18.185:8080`;

  useEffect(() => {
    // 1. Establish WebSocket connection
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      setLogs((prev) => [...prev, "--- WebSocket Connection Established ---"]);
    };

    // 2. Listen for messages from the server
    // The event is typed as MessageEvent for type safety.
    ws.onmessage = (event: MessageEvent) => {
      // It's good practice to ensure the data is a string
      if (typeof event.data === "string") {
        setLogs((prevLogs) => [...prevLogs, event.data]);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
      setLogs((prev) => [...prev, "--- WebSocket Connection Closed ---"]);
    };

    ws.onerror = (event: Event) => {
      console.error("WebSocket Error:", event);
      setLogs((prev) => [...prev, "--- WebSocket Error ---"]);
    };

    // 3. Cleanup on component unmount
    return () => {
      ws.close();
    };
  }, [wsUrl]); // Re-run effect if URL changes

  // Auto-scroll to the bottom of the log container
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>Docker Real-time Logs 🐳</h1>
      <div
        ref={logContainerRef}
        style={{
          height: "80vh",
          overflowY: "scroll",
          border: "1px solid #ccc",
          backgroundColor: "#1e1e1e",
          color: "#d4d4d4",
          padding: "10px",
          whiteSpace: "pre-wrap", // Wraps long lines
        }}
      >
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
    </div>
  );
}
