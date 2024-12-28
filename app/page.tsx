"use client";

import { Printer, Search, Database } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const createNewSession = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/games", {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      router.push(`/game/${data.gameId}`);
    } catch (error) {
      console.error("Failed to create game:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navigation />

      <div className="min-h-screen bg-gradient-to-b from-amber-100 to-red-100 text-gray-900">
        <main>
          <section className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-5xl font-extrabold mb-6">
              Votre Compagnon Ultime pour D&D
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {`Découvrez une nouvelle façon de gérer vos aventures D&D avec notre
            système d'index innovant. Imprimez, filtrez et accédez au contenu de
            D&D 5e comme jamais auparavant !`}
            </p>
            <button
              onClick={createNewSession}
              disabled={isLoading}
              className="bg-red-700 text-white p-5 text-xl rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed"
            >
              {isLoading
                ? "Création en cours..."
                : "Créer une nouvelle campagne"}
            </button>
          </section>

          <section id="features" className="container mx-auto px-4 py-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              Fonctionnalités Puissantes
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <Printer className="h-8 w-8 text-red-600 mr-2" />
                  <h3 className="text-xl font-semibold">
                    Impression Thermique
                  </h3>
                </div>
                <p>
                  Imprimez vos fiches de personnage, cartes de sorts et plus
                  encore sur du papier thermique. Compact, durable et toujours
                  prêt pour votre prochaine aventure.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <Search className="h-8 w-8 text-red-600 mr-2" />
                  <h3 className="text-xl font-semibold">
                    Filtrage en Temps Réel
                  </h3>
                </div>
                <p>
                  Trouvez exactement ce dont vous avez besoin en quelques
                  secondes grâce à notre puissant système de filtrage en temps
                  réel. Triez les sorts, objets et monstres avec facilité.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <Database className="h-8 w-8 text-red-600 mr-2" />
                  <h3 className="text-xl font-semibold">API SRD D&D 5e</h3>
                </div>
                <p>
                  {`Accédez à une vaste base de données de contenu D&D 5e grâce à
                notre intégration avec l'API SRD officielle. Toujours à jour et
                complète.`}
                </p>
              </div>
            </div>
          </section>

          <section
            id="cta"
            className="container mx-auto px-4 py-20 text-center"
          >
            <h2 className="text-3xl font-bold mb-6">
              Prêt à Améliorer Votre Expérience D&D ?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {`Rejoignez notre communauté d'aventuriers et emmenez vos parties de
            D&D au niveau supérieur. Inscrivez-vous maintenant pour être averti
            lors de notre lancement !`}
            </p>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
