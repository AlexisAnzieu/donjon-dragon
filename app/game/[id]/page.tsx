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
  const { data, isLoading } = useSWR<
    Prisma.GameGetPayload<{
      include: { characters: true };
    }>
  >(`/api/games?id=${id}`, fetcher);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className=" py-6 mb-8 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Personnages en jeu</h1>
            <Link
              href={`/character/edit?gameId=${id}`}
              className="inline-flex items-center px-6 py-3  rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 4v16m8-8H4"></path>
              </svg>
              Créer un personnage
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array(3)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="bg-white p-6 rounded-xl shadow-md animate-pulse"
                  >
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4 mt-4"></div>
                    </div>
                  </div>
                ))
            : data?.characters?.map((character, index: number) => (
                <div
                  key={index}
                  className="relative group transform transition-all duration-200 hover:scale-[1.02]"
                >
                  <Link
                    href={`/character/edit/?id=${character.id}`}
                    className="block"
                  >
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        {character.name}
                      </h2>
                      <div className="space-y-3 text-gray-600">
                        {[
                          { label: "Race", value: character.race },
                          { label: "Classe", value: character.class },
                          { label: "Historique", value: character.background },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center">
                            <span className="font-medium min-w-[100px]">
                              {item.label}:
                            </span>
                            <span className="ml-2">{item.value}</span>
                          </div>
                        ))}
                        <p className="text-sm text-gray-500 mt-6 pt-4 border-t border-gray-100">
                          Créé il y a{" "}
                          {formatDistanceToNow(new Date(character.createdAt), {
                            locale: fr,
                          })}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
