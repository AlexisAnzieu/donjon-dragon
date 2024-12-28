import type * as Party from "partykit/server";

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  async onConnect(conn: Party.Connection) {
    console.log("Client connected!", conn.id);

    conn.send(
      JSON.stringify({ type: "welcome", message: "Welcome to the game!" })
    );
  }

  async onMessage(message: string) {
    this.room.broadcast(message);
  }

  async onClose(conn: Party.Connection) {
    console.log("Client disconnected!", conn.id);
  }
}

Server satisfies Party.Worker;
