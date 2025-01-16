import { createContext, useContext, ReactNode } from "react";

const SessionContext = createContext<string | null>(null);

export function SessionProvider({
  sessionId,
  children,
}: {
  sessionId: string;
  children: ReactNode;
}) {
  return (
    <SessionContext.Provider value={sessionId}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const sessionId = useContext(SessionContext);
  if (!sessionId) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return sessionId;
}
