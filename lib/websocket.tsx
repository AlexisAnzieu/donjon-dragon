import usePartySocket from "partysocket/react";

export const useWebsocket = (sessionId: string) =>
  usePartySocket({
    host:
      process.env.NODE_ENV === "production"
        ? (process.env.NEXT_PUBLIC_PARTY_HOST ??
          "donjon-dragon-party.dndh2tclub.workers.dev")
        : "localhost:1999",
    room: `dnd-session-${sessionId}`,
  });
