import GameBoard from "@/app/game/components/Gameboard";
import prisma from "@/prisma/db";

async function getSession(sessionId: string) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      tokens: true,
    },
  });
  return session;
}

interface SessionPageProps {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ editable?: string }>;
}

export default async function SessionPage({
  params,
  searchParams,
}: SessionPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const session = await getSession(resolvedParams.sessionId);
  if (!session) return null;

  const isEditable = resolvedSearchParams.editable === "true";

  return (
    <GameBoard
      sessionId={resolvedParams.sessionId}
      initialTokens={session.tokens}
      fogOfWar={session.fogOfWar}
      isPublic={!isEditable}
      initialViewState={
        session.viewState as {
          zoom: number;
          position: { x: number; y: number };
        }
      }
    />
  );
}
