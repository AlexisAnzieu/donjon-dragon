/* eslint-disable @next/next/no-img-element */
import { Monster } from "@/app/api/monsters/route";
import Image from "next/image";
import {
  GiShield,
  GiHearts,
  GiRunningNinja,
  GiStarMedal,
} from "react-icons/gi";

export default function MonsterComponent(monster: Monster) {
  interface StatCircleProps {
    name: string;
    value: number;
    modifier: string;
  }

  function StatCircle({ name, value, modifier }: StatCircleProps) {
    return (
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-2 border-black flex items-center justify-center">
          <div className="text-2xl font-bold">{value}</div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center text-sm">
            {modifier}
          </div>
        </div>
        <div className="text-center mt-1 font-bold">{name}</div>
      </div>
    );
  }

  function Section({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) {
    return (
      <div className="mt-4">
        <h3 className="text-lg font-bold text-black mb-2">{title}</h3>
        {children}
      </div>
    );
  }

  function ListSection({ title, items }: { title: string; items: string[] }) {
    return (
      <Section title={title}>
        <p>{items.join(", ")}</p>
      </Section>
    );
  }

  function SavingThrows({
    savingThrows,
  }: {
    savingThrows: Record<string, string | null>;
  }) {
    return (
      <Section title="Jets de Sauvegarde">
        <ul className="list-disc list-inside">
          {savingThrows.STR && <li>Force: {savingThrows.STR}</li>}
          {savingThrows.DEX && <li>Dextérité: {savingThrows.DEX}</li>}
          {savingThrows.CON && <li>Constitution: {savingThrows.CON}</li>}
          {savingThrows.INT && <li>Intelligence: {savingThrows.INT}</li>}
          {savingThrows.WIS && <li>Sagesse: {savingThrows.WIS}</li>}
          {savingThrows.CHA && <li>Charisme: {savingThrows.CHA}</li>}
        </ul>
      </Section>
    );
  }

  function AbilitiesSection({
    title,
    abilities,
  }: {
    title: string;
    abilities: { name: string; description: string }[];
  }) {
    return (
      <Section title={title}>
        {abilities.map((ability) => (
          <div
            key={ability.name}
            className="bg-gray-100 border border-black rounded p-2 mb-2"
          >
            <h4 className="text-sm font-bold">{ability.name}</h4>
            <p className="text-xs">{ability.description}</p>
          </div>
        ))}
      </Section>
    );
  }

  return (
    <div
      id="MonsterComponent"
      className="w-[295px] bg-white text-black rounded-lg overflow-hidden shadow-lg relative border-4 border-black print:border-2"
    >
      <div className="p-3 relative z-10">
        <h2 className="text-3xl font-bold text-black mb-2 text-center font-serif">
          {monster.name}
        </h2>
        <p className="text-sm text-black mb-4 text-center italic">
          {monster.size} {monster.type}, {monster.alignment}
        </p>
        {monster.imageUrl && (
          <>
            <Image
              src={monster.imageUrl}
              className="rounded-full mx-auto m-5"
              width="150"
              height="150"
              alt={monster.name}
            />
          </>
        )}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <GiShield className="w-6 h-6 text-black mr-2" />
              <span className="text-sm font-semibold text-black">
                CA: {monster.armor_class}
              </span>
            </div>
            <div className="flex items-center">
              <GiHearts className="w-6 h-6 text-black mr-2" />
              <span className="text-sm font-semibold text-black">
                PV: {monster.hit_points} ({monster.hit_points_roll})
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <GiRunningNinja className="w-6 h-6 text-black mr-2" />
            <span className="text-sm font-semibold text-black">
              Vitesse: {monster.speed}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {monster.abilities.map((a) => (
            <StatCircle
              key={a.name}
              name={a.name}
              value={a.value}
              modifier={a.modifier}
            />
          ))}
        </div>

        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="flex items-center">
            <GiStarMedal className="w-6 h-6 text-black mr-2" />
            <span className="text-sm font-semibold text-black">
              XP: {monster.xp}
            </span>
          </div>
          <div className="flex items-center">
            <GiStarMedal className="w-6 h-6 text-black mr-2" />
            <span className="text-sm font-semibold text-black">
              CR: {monster.challenge_rating}
            </span>
          </div>
        </div>

        {monster.special_abilities.length > 0 && (
          <AbilitiesSection
            title="Capacités Spéciales"
            abilities={monster.special_abilities}
          />
        )}

        {monster.actions.length > 0 && (
          <AbilitiesSection title="Actions" abilities={monster.actions} />
        )}

        {monster.legendary_actions.length > 0 && (
          <AbilitiesSection
            title="Actions Légendaires"
            abilities={monster.legendary_actions}
          />
        )}

        {monster.saving_throws &&
          Object.keys(monster.saving_throws).length > 0 && (
            <SavingThrows savingThrows={monster.saving_throws} />
          )}

        {monster.skills?.length > 0 && (
          <ListSection title="Compétences" items={monster.skills} />
        )}

        {monster.senses.length > 0 && (
          <ListSection title="Sens" items={monster.senses} />
        )}

        {monster.languages.length > 0 && (
          <ListSection title="Langues" items={monster.languages} />
        )}

        {monster.damage_immunities?.length > 0 && (
          <ListSection
            title="Immunités aux Dégâts"
            items={monster.damage_immunities}
          />
        )}

        {monster.condition_immunities?.length > 0 && (
          <ListSection
            title="Immunités aux Conditions"
            items={monster.condition_immunities}
          />
        )}

        {monster.damage_resistances?.length > 0 && (
          <ListSection
            title="Résistances aux Dégâts"
            items={monster.damage_resistances}
          />
        )}

        {monster.damage_vulnerabilities?.length > 0 && (
          <ListSection
            title="Vulnérabilités aux Dégâts"
            items={monster.damage_vulnerabilities}
          />
        )}

        {monster.proficiency_bonus?.length > 0 && (
          <ListSection
            title="Bonus de Compétence"
            items={monster.proficiency_bonus}
          />
        )}
      </div>
    </div>
  );
}
