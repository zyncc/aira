// server.js
import { WebSocketServer } from "ws";
import { spawn } from "child_process";

const PORT = 8080;

// 1. Create a WebSocket server
const wss = new WebSocketServer({ port: PORT });
console.log(`✅ WebSocket server started on port ${PORT}`);

wss.on("connection", (ws) => {
  console.log("🔗 Client connected");
  ws.on("close", () => console.log("Client disconnected"));
});

// Function to broadcast data to all connected clients
function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      // 1 means OPEN
      client.send(data.toString());
    }
  });
}

// 2. Run 'docker compose up' as a child process
// Make sure to run this script from the directory containing your docker-compose.yml
const dockerProcess = spawn("docker", ["compose", "up"]);

// 3. Listen to the standard output and broadcast it
dockerProcess.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
  broadcast(data);
});

// 4. Listen to the standard error and broadcast it (optional but recommended)
dockerProcess.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
  broadcast(data); // Send errors to the client as well
});

dockerProcess.on("close", (code) => {
  const message = `Docker Compose process exited with code ${code}`;
  console.log(message);
  broadcast(message);
});
