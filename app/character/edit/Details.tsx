import { useCharacter } from "./characterContext";
import {
  GiPerson,
  GiHearts,
  GiStarMedal,
  GiChainedHeart,
  GiSkullCrack,
} from "react-icons/gi";

interface DetailField {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: keyof CharacterDetails;
}

interface CharacterDetails {
  name: string;
  alignment: string;
  traits: string;
  ideals: string;
  bonds: string;
  flaws: string;
}

export default function Details() {
  const { details, setDetails } = useCharacter();

  const detailFields: DetailField[] = [
    { icon: GiStarMedal, label: "Traits de personnalité", value: "traits" },
    { icon: GiHearts, label: "Idéaux", value: "ideals" },
    { icon: GiChainedHeart, label: "Liens", value: "bonds" },
    { icon: GiSkullCrack, label: "Défauts", value: "flaws" },
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="group">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <GiPerson className="w-5 h-5" />
            Nom du personnage
          </label>
          <input
            type="text"
            value={details.name}
            onChange={(e) => setDetails({ ...details, name: e.target.value })}
            placeholder="Nom du personnage"
            className="w-full px-4 py-2 bg-white rounded-lg border border-gray-200 transition-all duration-200 ease-in-out
                     focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-gray-300
                     placeholder:text-gray-400"
          />
        </div>

        <div className="group">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <GiHearts className="w-5 h-5" />
            Alignement
          </label>
          <select
            aria-label="Alignement"
            value={details.alignment}
            onChange={(e) =>
              setDetails({ ...details, alignment: e.target.value })
            }
            className="w-full px-4 py-2 bg-white rounded-lg border border-gray-200 transition-all duration-200 ease-in-out
                     focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-gray-300"
          >
            <option value="">Sélectionner...</option>
            <option value="LB">Loyal Bon</option>
            <option value="NB">Neutre Bon</option>
            <option value="CB">Chaotique Bon</option>
            <option value="LN">Loyal Neutre</option>
            <option value="N">Neutre</option>
            <option value="CN">Chaotique Neutre</option>
            <option value="LM">Loyal Mauvais</option>
            <option value="NM">Neutre Mauvais</option>
            <option value="CM">Chaotique Mauvais</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {detailFields.map(({ icon: Icon, label, value }) => (
          <div key={value} className="group">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Icon className="w-4 h-4" />
              {label}
            </label>
            <textarea
              title={label}
              placeholder={`Entre tes ${label.toLowerCase()}`}
              value={details[value]}
              onChange={(e) =>
                setDetails({ ...details, [value]: e.target.value })
              }
              className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 transition-all duration-200 ease-in-out
                       focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-gray-300
                       resize-none"
              rows={3}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
