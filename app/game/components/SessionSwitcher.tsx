"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BoardSession } from "@/app/api/sessions/route";

interface Session {
  id: string;
  name: string;
  createdAt: Date;
}

interface SessionSwitcherProps {
  currentSessionId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function SessionSwitcher({
  currentSessionId,
  isOpen,
  onClose,
}: SessionSwitcherProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      fetch(`/api/sessions?id=${currentSessionId}`)
        .then((res) => res.json())
        .then((data: BoardSession) => {
          // Filter out current session
          const filteredSessions = data.game.sessions.filter(
            (session) => session.id !== currentSessionId
          );
          setSessions(filteredSessions);
        })
        .catch((error) => {
          console.error("Failed to fetch sessions:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, currentSessionId]);

  const handleSessionSelect = (sessionId: string) => {
    const currentPath = window.location.pathname;
    const gameId = currentPath.split("/")[2]; // Extract gameId from URL path
    router.push(`/game/${gameId}/session/${sessionId}?editable=true`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-gray-800 rounded-lg p-6 w-96 max-h-[80vh] flex flex-col mx-auto shadow-xl border border-gray-700">
        <h2 className="text-white text-xl font-semibold mb-4">
          Switch Session
        </h2>
        <div className="space-y-3 overflow-y-auto flex-1 pr-2">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : (
            sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => handleSessionSelect(session.id)}
                className="w-full text-left p-4 rounded-lg transition-colors bg-gray-700/50 text-white hover:bg-gray-600 hover:scale-[1.02] transform duration-100"
              >
                <div className="font-medium">{session.name}</div>
                <div className="text-sm text-gray-300">
                  {new Date(session.createdAt).toLocaleDateString()}
                </div>
              </button>
            ))
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
