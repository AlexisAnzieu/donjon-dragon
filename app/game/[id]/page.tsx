"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Prisma } from "@prisma/client";
import TooltipText from "@/app/components/TooltipText";

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
        <div className="grid grid-cols-1 gap-8">
          {/* Characters Table Section */}
          <div className="bg-white rounded-xl shadow-md overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Race
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Classe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Historique
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <TooltipText text="Alignement">
                      <div className="p-4 max-w-md lowercase">
                        <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">
                          Les alignements dans D&D 5e
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <h4 className="font-semibold text-emerald-700">
                              Alignements Bons
                            </h4>
                            <div className="ml-2 space-y-1 text-sm">
                              <p>
                                <span className="font-medium uppercase">
                                  LB
                                </span>{" "}
                                - Loyal Bon: Suit un code d'honneur strict et
                                aide les autres
                              </p>
                              <p>
                                <span className="font-medium uppercase">
                                  NB
                                </span>{" "}
                                - Neutre Bon: Fait le bien sans se préoccuper
                                des lois
                              </p>
                              <p>
                                <span className="font-medium uppercase">
                                  CB
                                </span>{" "}
                                - Chaotique Bon: Suit sa conscience, privilégie
                                la liberté
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-semibold text-amber-700">
                              Alignements Neutres
                            </h4>
                            <div className="ml-2 space-y-1 text-sm">
                              <p>
                                <span className="font-medium uppercase">
                                  LN
                                </span>{" "}
                                - Loyal Neutre: Suit les règles sans parti pris
                                moral
                              </p>
                              <p>
                                <span className="font-medium uppercase">N</span>{" "}
                                - Neutre: Maintient l'équilibre, évite les
                                extrêmes
                              </p>
                              <p>
                                <span className="font-medium uppercase">
                                  CN
                                </span>{" "}
                                - Chaotique Neutre: Valorise sa liberté
                                personnelle
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-semibold text-red-700">
                              Alignements Mauvais
                            </h4>
                            <div className="ml-2 space-y-1 text-sm">
                              <p>
                                <span className="font-medium uppercase">
                                  LM
                                </span>{" "}
                                - Loyal Mauvais: Oppresse méthodiquement les
                                autres
                              </p>
                              <p>
                                <span className="font-medium uppercase">
                                  NM
                                </span>{" "}
                                - Neutre Mauvais: Fait le mal pour son profit
                                personnel
                              </p>
                              <p>
                                <span className="font-medium uppercase">
                                  CM
                                </span>{" "}
                                - Chaotique Mauvais: Agit avec cruauté et
                                destruction
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TooltipText>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Créé
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading
                  ? Array(3)
                      .fill(0)
                      .map((_, index) => (
                        <tr key={`skeleton-${index}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 rounded w-28"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 rounded w-28"></div>
                          </td>
                        </tr>
                      ))
                  : data?.characters?.map((character, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() =>
                          (window.location.href = `/character/edit/?id=${character.id}`)
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          {character.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {character.race}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {character.class}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {character.background}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {character.alignment}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDistanceToNow(new Date(character.createdAt), {
                            locale: fr,
                          })}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Calendar Section */}
          <div className="w-full bg-white p-4 rounded-xl shadow-md">
            <iframe
              src="https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=America%2FToronto&showPrint=0&showTz=0&showTabs=0&showNav=0&mode=AGENDA&showDate=0&title=DND%20H2T&src=MGQzY2Y2ODY5Mzg4MTE3NjdiOTEyOGU0ZGIwZjE0ZDQ1MTk4MThmYWJkMjdjNGIzZmE1N2IzZGI0MjVjZmFkMUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23F09300"
              className="w-full h-[300px]"
              frameBorder="0"
              scrolling="no"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
