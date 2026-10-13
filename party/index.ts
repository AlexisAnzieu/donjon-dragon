import { routePartykitRequest, Server } from "partyserver";
import type { Connection } from "partyserver";

type Env = {
  Main: DurableObjectNamespace<GameServer>;
};

// Binding is named "Main" so it kebab-cases to the default "main" party,
// keeping existing partysocket clients working without changes.
export class GameServer extends Server<Env> {
  onConnect(conn: Connection) {
    console.log("Client connected!", conn.id);

    conn.send(
      JSON.stringify({ type: "welcome", message: "Welcome to the game!" }),
    );
  }

  onMessage(_sender: Connection, message: string) {
    this.broadcast(message);
  }

  onClose(conn: Connection) {
    console.log("Client disconnected!", conn.id);
  }
}

export default {
  async fetch(request, env): Promise<Response> {
    return (
      (await routePartykitRequest(request, env)) ||
      new Response("Not Found", { status: 404 })
    );
  },
} satisfies ExportedHandler<Env>;
