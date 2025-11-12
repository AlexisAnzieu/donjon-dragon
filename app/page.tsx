import { Search, Database } from "lucide-react";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import { buildAuthRedirectUrl } from "@/lib/auth-redirect";

export default function Home() {
  let loginUrl = "/";

  try {
    loginUrl = buildAuthRedirectUrl("/dashboard");
  } catch (error) {
    console.error("Failed to build login URL for homepage CTA", error);
  }

  return (
    <>
      <Navigation />

      <div className="min-h-screen bg-gradient-to-b from-amber-100 to-red-100 text-gray-900">
        <main>
          <section className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-5xl font-extrabold mb-6 text-red-900">
              The Ultimate Digital Grimoire for D&D
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Embark on legendary adventures with our enchanted virtual
              tabletop. Master spells of real-time collaboration, wield powerful
              tools for battle management, and chronicle your epic tales like
              never before!
            </p>
          </section>

          <section id="features" className="container mx-auto px-4 py-20">
            <h2 className="text-3xl font-bold text-center mb-12 text-red-900">
              Legendary Features
            </h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Battle Mastery",
                  icon: <Search className="h-8 w-8 text-red-600" />,
                  description:
                    "Command your battlefield with real-time token management, dynamic fog of war, and tactical zoom controls. Your virtual tabletop awaits!",
                },
                {
                  title: "Monster Grimoire",
                  icon: <Database className="h-8 w-8 text-red-600" />,
                  description:
                    "Access an extensive bestiary of creatures with stats, abilities, and legendary actions. Print stat blocks with our mystical thermal printing system.",
                },
                {
                  title: "Character Forge",
                  icon: (
                    <svg
                      className="h-8 w-8 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  ),
                  description:
                    "Forge legendary heroes with our comprehensive character builder and personality quiz system. Choose your class, race, and destiny!",
                },
                {
                  title: "Soundcraft",
                  icon: (
                    <svg
                      className="h-8 w-8 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.536 8.464a5 5 0 010 7.072M17.536 6.464a7 7 0 010 11.072M9.464 8.464a5 5 0 010 7.072M7.464 6.464a7 7 0 010 11.072M4 10v4a8 8 0 0016 0v-4"
                      />
                    </svg>
                  ),
                  description:
                    "Weave atmospheric magic with our sound system. Control soundscapes via MIDI, create custom libraries, and synchronize with dramatic lighting effects.",
                },
                {
                  title: "Equipment Arsenal",
                  icon: (
                    <svg
                      className="h-8 w-8 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                  ),
                  description:
                    "Master an extensive collection of weapons and armor. Track equipment costs, manage damage types, and customize your gear loadout.",
                },
                {
                  title: "Session Chronicles",
                  icon: (
                    <svg
                      className="h-8 w-8 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  ),
                  description:
                    "Chronicle your adventures with our session management system. Track quests, manage party rosters, and switch between multiple campaigns.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 shadow-lg transform hover:scale-105 transition-transform duration-200"
                >
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold ml-4">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-700">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section
            id="cta"
            className="container mx-auto px-4 py-20 text-center bg-gradient-to-r from-red-100 to-amber-100 rounded-lg shadow-xl"
          >
            <h2 className="text-4xl font-bold mb-6 text-red-900">
              Ready to Begin Your Digital Adventure?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-800">
              Join our fellowship of adventurers and elevate your D&D campaigns
              to legendary status. Create your account now and unlock the full
              power of our digital grimoire!
            </p>
            <div className="flex justify-center gap-4">
              <a
                href={loginUrl}
                className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Sign In
              </a>
              <a
                href={loginUrl}
                className="px-8 py-3 bg-amber-100 text-red-900 rounded-lg border-2 border-red-600 hover:bg-amber-200 transition-colors duration-200"
              >
                Create Account
              </a>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
