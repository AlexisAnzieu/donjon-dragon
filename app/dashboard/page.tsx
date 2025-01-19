/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

async function getUserData(userId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const res = await fetch(`${baseUrl}/api/users?id=${userId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch user data");
  return res.json();
}

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  const userData = await getUserData(session.user!.id as string);

  return (
    <div className="p-8">
      <div className="grid gap-6 md:grid-cols-2">
        <section className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Hosted Games</h2>
          {userData.hostedgames.length === 0 ? (
            <p className="text-gray-500">No hosted games yet</p>
          ) : (
            <ul className="space-y-2">
              {userData.hostedgames.map((game: any) => (
                <li key={game.id} className="p-3 bg-gray-50 rounded">
                  <Link
                    href={`/game/${game.id}`}
                    className="hover:text-blue-600"
                  >
                    {game.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Characters</h2>
          {userData.characters.length === 0 ? (
            <p className="text-gray-500">No characters created yet</p>
          ) : (
            <ul className="space-y-2">
              {userData.characters.map((character: any) => (
                <li key={character.name} className="p-3 bg-gray-50 rounded">
                  <span>{character.name}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({character.games.length} games)
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {userData.soundLibrary && (
          <section className="border rounded-lg p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">User Sound Library</h2>
            {/* Add sound library content here */}
          </section>
        )}
      </div>
    </div>
  );
}
