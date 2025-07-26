"use client";

import { useEffect, useState } from "react";

export default function LogsPage() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://13.201.18.185:8080"); // 👈 Use public IP or domain

    ws.onmessage = (event) => {
      setLogs((prev) => [...prev, event.data]);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="bg-black text-green-500 p-4 font-mono whitespace-pre-wrap h-screen overflow-y-auto">
      {logs.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
    </div>
  );
}
