/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetcher } from "@/lib/fetcher";
import useSWR, { mutate } from "swr";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Prisma } from "@prisma/client";
import TooltipText from "@/app/character/TooltipText";

export default function Game() {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const { data, isLoading } = useSWR<
    Prisma.GameGetPayload<{
      include: { characters: true; sessions: true };
    }>
  >(`/api/games?id=${id}`, fetcher);

  const handleCreateSession = async () => {
    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId: id,
          name: sessionName,
        }),
      });

      const newSession = await response.json();
      window.location.href = `/game/${id}/session/${newSession.id}?editable=true`;
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const handleDeleteSession = async (
    sessionId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (confirm("Êtes-vous sûr de vouloir supprimer cette session ?")) {
      try {
        await fetch(`/api/sessions?id=${sessionId}`, {
          method: "DELETE",
        });
        // Trigger SWR revalidation
        mutate(`/api/games?id=${id}`);
      } catch (error) {
        console.error("Error deleting session:", error);
      }
    }
  };

  const handleUpdateName = async () => {
    try {
      await fetch(`/api/games?id=${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName }),
      });
      mutate(`/api/games?id=${id}`);
      setIsEditingName(false);
    } catch (error) {
      console.error("Error updating game name:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className=" py-6 mb-8 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="text-3xl font-bold px-2 py-1 border rounded"
                  placeholder={data?.name}
                  autoFocus
                />
                <button
                  title="Update name"
                  onClick={handleUpdateName}
                  className="p-2 text-green-600 hover:text-green-800"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </button>
                <button
                  title="Cancel"
                  onClick={() => {
                    setIsEditingName(false);
                    setNewName("");
                  }}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div
                className="flex items-center gap-2 group cursor-pointer"
                onClick={() => {
                  setIsEditingName(true);
                  setNewName(data?.name || "");
                }}
              >
                <h1 className="text-3xl font-bold">{data?.name}</h1>
                <svg
                  className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </div>
            )}
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
                          <a
                            href={`https://5e-drs.fr/races/${character.race?.toLowerCase()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {character.race}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          <a
                            href={`https://5e-drs.fr/classes/${character.class?.toLowerCase()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {character.class}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          <a
                            href={`https://www.aidedd.org/regles/historiques/${character.background}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {character.background}
                          </a>
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

          {/* Calendar and Links Section */}
          {id === "cm3gc9o5l001euleokyus4z7d" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-4 rounded-xl shadow-md">
                <iframe
                  title="Calendrier de la campagne"
                  src="https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=America%2FToronto&showPrint=0&showTz=0&showTabs=0&showNav=0&mode=AGENDA&showDate=0&title=DND%20H2T&src=MGQzY2Y2ODY5Mzg4MTE3NjdiOTEyOGU0ZGIwZjE0ZDQ1MTk4MThmYWJkMjdjNGIzZmE1N2IzZGI0MjVjZmFkMUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23F09300"
                  className="w-full h-[300px]"
                  frameBorder="0"
                  scrolling="no"
                />
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold mb-4">Liens utiles</h2>
                <div className="space-y-4">
                  <a
                    href="https://drive.google.com/drive/folders/1CxDwj1T_-8Ke_Cmu-TKEnjJpvn86odVc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group shadow-sm hover:shadow-md"
                  >
                    <div className="bg-blue-500 p-2 rounded-full group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <span className="font-medium text-blue-700 group-hover:text-blue-800">
                        Google Drive
                      </span>
                      <p className="text-sm text-blue-600/70">
                        Accédez aux différents documents de la campagne
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 ml-auto text-blue-400 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                  <a
                    href="https://donjonetdragon.fr/creer-son-personnage-dnd-5/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group shadow-sm hover:shadow-md"
                  >
                    <div className="bg-blue-500 p-2 rounded-full group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <span className="font-medium text-blue-700 group-hover:text-blue-800">
                        Fiche de personnage
                      </span>
                      <p className="text-sm text-blue-600/70">
                        Apprenez à remplir votre fiche de personnage
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 ml-auto text-blue-400 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-2xl font-bold mb-4 md:mb-0">Sessions de jeu</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
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
            Créer une session de jeu
          </button>
        </div>

        {!!data?.sessions?.length && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.sessions.map((session, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 cursor-pointer transition-colors duration-150 group"
                      onClick={() =>
                        (window.location.href = `/game/${id}/session/${session.id}`)
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {new Date(session.createdAt).toLocaleDateString(
                          "fr-FR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span>{session.name}</span>
                            <svg
                              className="w-4 h-4 ml-2 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              title="Modifier la session"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = `/game/${id}/session/${session.id}?editable=true`;
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-blue-100 rounded-full"
                            >
                              <svg
                                className="w-5 h-5 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              title="Supprimer la session"
                              onClick={(e) =>
                                handleDeleteSession(session.id, e)
                              }
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-red-100 rounded-full"
                            >
                              <svg
                                className="w-5 h-5 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!data?.sessions?.length && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 48 48"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h32M8 24h32M8 36h32"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Aucune session
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Commencez par créer votre première session de jeu.
            </p>
          </div>
        )}
      </div>

      {/* Session Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96">
            <h2 className="text-xl font-bold mb-4">
              Créer une nouvelle session
            </h2>
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="Nom de la session"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSessionName("");
                }}
                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  handleCreateSession();
                  setIsModalOpen(false);
                }}
                disabled={!sessionName.trim()}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
