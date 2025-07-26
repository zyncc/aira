import { spawn } from "child_process";
import { WebSocketServer } from "ws";

const PORT = 8080;

const wss = new WebSocketServer({ port: PORT }, () => {
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});

wss.on("connection", (ws) => {
  console.log("Client connected");

  const dockerLogs = spawn("docker", ["compose", "logs", "-f", "nextjs"]);

  dockerLogs.stdout.on("data", (data) => {
    ws.send(data.toString());
  });

  dockerLogs.stderr.on("data", (data) => {
    ws.send(`ERROR: ${data.toString()}`);
  });

  dockerLogs.on("close", () => {
    ws.send("Log stream closed");
    ws.close();
  });

  ws.on("close", () => {
    dockerLogs.kill();
    console.log("Client disconnected");
  });
});
