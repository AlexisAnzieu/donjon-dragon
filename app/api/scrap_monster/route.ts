/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSDOM } from "jsdom";
import prisma from "@/prisma/db";
import { scrapped_monsters } from "./scrapped_data";

const abilityMap = {
  FOR: "STR",
  DEX: "DEX",
  CON: "CON",
  INT: "INT",
  SAG: "WIS",
  CHA: "CHA",
};

const attributeMap = {
  sens: "senses",
  langues: "languages",
  puissance: "challenge_rating",
  jets_de_sauvegarde: "saving_throws",
  résistances_aux_dégâts: "damage_resistances",
  immunités_aux_dégâts: "damage_immunities",
  immunités_aux_états: "condition_immunities",
  bonus_de_maîtrise: "proficiency_bonus",
  compétences: "skills",
  vulnérabilités_aux_dégâts: "damage_vulnerabilities",
};

async function fetchDocument(url: string): Promise<Document> {
  const response = await fetch(url);
  const text = await response.text();
  const dom = new JSDOM(text);
  return dom.window.document;
}

// function extractUrls(document: Document): string[] {
//   const items = document.querySelectorAll(".item a");
//   return Array.from(items).map((item) => (item as HTMLAnchorElement).href);
// }

function extractName(document: Document): string | null {
  return document.querySelector(".jaune h1")?.textContent?.trim() || null;
}

function extractTypeSizeAlignment(
  document: Document
): { type: string; size: string; alignment: string } | null {
  const typeText = document.querySelector(".type")?.textContent?.trim();
  const typeMatch = typeText?.match(/\s*(.+?)\s*de taille\s+(\w+),\s*(.+)/i);

  if (!typeMatch) return null;
  return {
    type: typeMatch[1].toLowerCase(),
    size: typeMatch[2],
    alignment: typeMatch[3],
  };
}

function extractArmorClass(document: Document): string | null {
  return (
    document.querySelector(".red strong")?.nextSibling?.textContent?.trim() ||
    null
  );
}

function extractHitPoints(document: Document): {
  hit_points: number | null;
  hit_dice: string | null;
  hit_points_roll: string | null;
} {
  const hitPointsText = document
    .querySelector(".red strong:nth-of-type(2)")
    ?.nextSibling?.textContent?.trim();
  const hitPointsMatch = hitPointsText?.match(/(\d+) \(([^)]+)\)/);
  return {
    hit_points: hitPointsMatch ? parseInt(hitPointsMatch[1]) : 0,
    hit_dice: hitPointsMatch
      ? hitPointsMatch[2].split(" + ")[0]
      : hitPointsMatch?.[1] ?? null,
    hit_points_roll: hitPointsMatch ? hitPointsMatch[2] : null,
  };
}

function extractSpeed(document: Document): string | null {
  return (
    document
      .querySelector(".red strong:nth-of-type(3)")
      ?.nextSibling?.textContent?.trim() || null
  );
}

function extractAbilities(
  document: Document
): { name: string; value: number; modifier: string }[] {
  return Array.from(document.querySelectorAll(".carac")).map((carac) => {
    const text = carac.textContent?.trim();
    const name = text?.substring(0, 3);
    const [value, modifier] = text?.substring(3).trim().split(" ") || [];
    const abilityKey = abilityMap[name as keyof typeof abilityMap];
    return {
      name: abilityKey,
      value: +value,
      modifier: modifier.replace(/[()]/g, ""),
    };
  });
}

function extractActions(document: Document): any[] {
  const actions = [];
  const legendary_actions = [];
  let isInLegendaryActions = false;
  let currentElement = document.querySelector(".rub");
  while (currentElement) {
    currentElement = currentElement.nextElementSibling as HTMLElement;
    if (currentElement?.classList.contains("rub")) {
      isInLegendaryActions = true;
      currentElement = currentElement.nextElementSibling as HTMLElement;
    }
    const [key, ...rest] = currentElement?.textContent?.trim().split(".") || [];
    const value = rest.join(".");
    if (key && value) {
      if (!isInLegendaryActions) {
        actions.push({ [key]: value });
      } else {
        legendary_actions.push({ [key]: value });
      }
    }
  }
  return [actions, legendary_actions];
}

function extractAdditionalAttributes(document: Document): Record<string, any> {
  const additionalAttributes: Record<string, any> = {};
  const redElements = document.querySelectorAll(".red strong");
  redElements.forEach((element, index) => {
    if (index >= 3) {
      const key = element.textContent?.trim();
      const value = element.nextSibling?.textContent?.trim();
      if (key && value) {
        const translatedKey =
          attributeMap[
            key.toLowerCase().replace(/\s+/g, "_") as keyof typeof attributeMap
          ];
        if (translatedKey) {
          if (translatedKey === "saving_throws") {
            additionalAttributes[translatedKey] = value
              .split(", ")
              .reduce((acc: Record<string, string>, item) => {
                const [ability, v] = item.split(" ");
                const abilityKey =
                  ability.toUpperCase() as keyof typeof abilityMap;
                acc[abilityMap[abilityKey]] = v;
                return acc;
              }, {});
          } else if (translatedKey === "challenge_rating") {
            const [rating, xpText] = value.split(" (");
            additionalAttributes[translatedKey] = +rating;
            additionalAttributes["xp"] =
              parseInt(xpText?.replace(" PX)", "")) || 0;
          } else {
            additionalAttributes[translatedKey] = value.split(", ");
          }
        }
      }
    }
  });
  return additionalAttributes;
}

function extractDescription(document: Document): string | null {
  return document.querySelector(".description")?.textContent?.trim() || null;
}

function extractSource(document: Document): string | null {
  return document.querySelector(".source")?.textContent?.trim() || null;
}

function extractImageUrl(document: Document): string | null {
  return (
    (document.querySelector(".picture img") as HTMLImageElement)?.src || null
  );
}

function extractSpecialAbilities(document: Document): any[] {
  const actions = [];
  let currentElement = document.querySelector("polyline:last-of-type")
    ?.parentElement?.parentElement;
  while (currentElement) {
    currentElement = currentElement.nextElementSibling as HTMLElement;

    if (currentElement?.classList.contains("rub")) {
      break;
    }
    const [key, ...rest] = currentElement?.textContent?.trim().split(".") || [];
    const value = rest.join(".");
    if (key && value) {
      actions.push({ [key]: value });
    }
  }
  return actions;
}

function extractMonsterData(document: Document): any {
  const name = extractName(document);
  const slug = name
    ?.toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[ç]/g, "c")
    .replace(/[ñ]/g, "n")
    .replace(/[,/']/g, "");
  const typeSizeAlignment = extractTypeSizeAlignment(document);
  const armor_class = extractArmorClass(document);
  const hitPoints = extractHitPoints(document);
  const speed = extractSpeed(document);
  const abilities = extractAbilities(document);
  const [actions, legendary_actions] = extractActions(document);
  const additionalAttributes = extractAdditionalAttributes(document);
  const description = extractDescription(document);
  const source = extractSource(document);
  const imageUrl = extractImageUrl(document);
  const special_abilities = extractSpecialAbilities(document);

  return {
    name,
    slug,
    size: typeSizeAlignment?.size,
    type: typeSizeAlignment?.type,
    alignment: typeSizeAlignment?.alignment,
    armor_class,
    hit_points: hitPoints.hit_points,
    hit_dice: hitPoints.hit_dice,
    hit_points_roll: hitPoints.hit_points_roll,
    speed,
    abilities,
    actions,
    legendary_actions,
    special_abilities,
    description,
    source,
    imageUrl,
    ...additionalAttributes,
  };
}

export async function GET() {
  // const document = await fetchDocument(
  //   "https://www.aidedd.org/dnd-filters/monstres.php"
  // );
  // const urls = extractUrls(document);
  const urls = scrapped_monsters.slice(0, 50);

  const results = [];

  for (const url of urls.slice(0, 1000)) {
    const itemDocument = await fetchDocument(url);

    try {
      const monsterData = extractMonsterData(itemDocument);

      console.log("done", monsterData.slug);

      const existingMonster = await prisma.monster.findUnique({
        where: { slug: monsterData.slug },
      });

      if (!existingMonster) {
        console.log("not done", monsterData.slug);

        const {
          abilities,
          actions,
          special_abilities,
          saving_throws,
          legendary_actions,
          ...monster
        } = monsterData;

        await prisma.monster.create({
          data: {
            ...monster,
            abilities: {
              create: abilities,
            },
            legendary_actions: {
              create: legendary_actions.map((action: any) => ({
                name: Object.keys(action)[0],
                description: Object.values(action)[0],
              })),
            },
            actions: {
              create: actions.map((action: any) => ({
                name: Object.keys(action)[0],
                description: Object.values(action)[0],
              })),
            },
            special_abilities: {
              create: special_abilities.map((ability: any) => ({
                name: Object.keys(ability)[0],
                description: Object.values(ability)[0],
              })),
            },
            saving_throws: {
              create: saving_throws,
            },
          },
        });
      }
      results.push(monsterData);
    } catch (error) {
      throw new Error(`Error parsing ${url}: ${error}`);
    }
  }

  return new Response("done", {
    headers: { "Content-Type": "application/json" },
  });
}
