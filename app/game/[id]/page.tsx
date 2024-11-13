"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Prisma } from "@prisma/client";

export default function Game() {
  const { id } = useParams();
  const {
    data,
  }: {
    data: Prisma.GameGetPayload<{
      include: { characters: true };
    }>;
  } = useSWR(`/api/games?id=${id}`, fetcher);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex  mb-8">
          <Link
            href={`/character/edit?gameId=${id}`}
            className="px-6 py-3 bg-red-800 text-white text-lg rounded-xl hover:bg-red-700 transition-colors"
          >
            Créer un personnage
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Personnages en jeu
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.characters.map((character, index: number) => (
            <Link
              href={`/character/edit/?id=${character.id}`}
              key={index}
              className="block"
            >
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {character.race}
                </h2>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <span className="font-medium">Classe:</span>{" "}
                    {character.class}
                  </p>
                  <p>
                    <span className="font-medium">Historique:</span>{" "}
                    {character.background}
                  </p>
                  <p className="text-sm text-gray-500 mt-4">
                    Créé il y a{" "}
                    {formatDistanceToNow(new Date(character.createdAt), {
                      locale: fr,
                    })}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
