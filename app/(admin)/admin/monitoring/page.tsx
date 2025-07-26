"use client";

import { useEffect, useRef, useState } from "react";

export default function LogsPage() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const socket = new WebSocket("wss://logs.airaclothing.in");

    socket.onmessage = (event) => {
      setLogs((prev) => {
        const updated = [...prev, event.data];
        return updated.slice(-500); // Keep last 500 lines
      });
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      socket.close();
    };
  }, []);

  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div
      ref={logRef}
      className="bg-black text-green-500 p-4 font-mono whitespace-pre-wrap h-screen overflow-y-auto"
    >
      {logs.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
    </div>
  );
}
