/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUserFromCookie } from "@/lib/auth";
import { buildAuthRedirectUrl } from "@/lib/auth-redirect";
import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import prisma from "@/prisma/db";

export const dynamic = "force-dynamic";

async function createNewCampaign(formData: FormData) {
  "use server";
  const userId = formData.get("userId") as string;

  try {
    await prisma.game.create({
      data: {
        characters: {
          create: [],
        },
        gameMasterId: userId,
      },
    });

    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Failed to create game:", error);
  }
}

async function deleteCampaign(formData: FormData) {
  "use server";
  const gameId = formData.get("gameId") as string;

  try {
    await prisma.game.delete({
      where: {
        id: gameId,
      },
    });

    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Failed to delete game:", error);
  }
}

async function getUserData(userId: string) {
  const baseUrl = process.env.WEBSITE_URL || "";
  const res = await fetch(`${baseUrl}/api/users?id=${userId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch user data");
  return res.json();
}

export default async function Dashboard() {
  let userId: string;

  try {
    const user = await getUserFromCookie();
    userId = user.id;
  } catch (error) {
    console.error("Unable to resolve user from auth cookie", error);
    redirect(buildAuthRedirectUrl("/dashboard"));
  }

  const userData = await getUserData(userId);

  return (
    <div className="p-8">
      <div className="grid gap-6 md:grid-cols-2">
        <section className="border rounded-lg p-6">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold">Your Hosted Games</h2>
            <form action={createNewCampaign}>
              <input type="hidden" name="userId" value={userId} />
              <button
                type="submit"
                className="ml-2 p-1 rounded-full hover:bg-gray-200"
                title="Create new campaign"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </form>
          </div>
          {userData?.hostedgames.length === 0 ? (
            <p className="text-gray-500">No hosted games yet</p>
          ) : (
            <ul className="space-y-2">
              {userData?.hostedgames.map((game: any) => (
                <li
                  key={game.id}
                  className="p-3 bg-gray-50 rounded flex justify-between items-center"
                >
                  <Link
                    href={`/game/${game.id}`}
                    className="hover:text-blue-600"
                  >
                    {game.name}
                  </Link>
                  <form action={deleteCampaign}>
                    <input type="hidden" name="gameId" value={game.id} />
                    <button
                      type="submit"
                      className="text-gray-500 hover:text-red-600"
                      title="Delete campaign"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
