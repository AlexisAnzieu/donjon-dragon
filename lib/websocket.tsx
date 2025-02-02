import usePartySocket from "partysocket/react";

export const useWebsocket = (sessionId: string) =>
  usePartySocket({
    host:
      process.env.NODE_ENV === "production"
        ? "donjon-dragon-party.alexisanzieu.partykit.dev"
        : "localhost:1999",
    room: `dnd-session-${sessionId}`,
  });
