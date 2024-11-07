interface Question {
  question: string;
  answers: {
    text: string;
    scores: Record<string, number>;
  }[];
}

export const questions: Question[] = [
  {
    question: "Comment préfères-tu passer ton temps libre ?",
    answers: [
      { text: "En communion avec la nature", scores: { Elfe: 2, Barde: 1 } },
      {
        text: "En partageant un bon repas",
        scores: { Halfelin: 2, Clerc: 1 },
      },
      {
        text: "En explorant de nouveaux endroits",
        scores: { Humain: 2, Roublard: 1 },
      },
      {
        text: "En forgeant ou en travaillant",
        scores: { Nain: 2, Guerrier: 1 },
      },
    ],
  },
  {
    question: "Quelle est ta plus grande qualité ?",
    answers: [
      { text: "Ma grâce et mon agilité", scores: { Elfe: 2, Roublard: 1 } },
      {
        text: "Ma jovialité et ma chance",
        scores: { Halfelin: 2, Barde: 1 },
      },
      { text: "Mon adaptabilité", scores: { Humain: 2, Magicien: 1 } },
      { text: "Ma force et mon endurance", scores: { Nain: 2, Guerrier: 1 } },
    ],
  },
  {
    question: "Quel environnement te plaît le plus ?",
    answers: [
      { text: "Les forêts enchantées", scores: { Elfe: 2, Magicien: 1 } },
      {
        text: "Les villages pittoresques",
        scores: { Halfelin: 2, Clerc: 1 },
      },
      { text: "Les grandes cités", scores: { Humain: 2, Barde: 1 } },
      { text: "Les montagnes et cavernes", scores: { Nain: 2, Guerrier: 1 } },
    ],
  },
  {
    question: "Quel est ton passe-temps favori ?",
    answers: [
      { text: "La musique et la poésie", scores: { Elfe: 1, Barde: 2 } },
      {
        text: "La cuisine et les festins",
        scores: { Halfelin: 1, Clerc: 2 },
      },
      {
        text: "Les études et la recherche",
        scores: { Humain: 1, Magicien: 2 },
      },
      {
        text: "Le combat et l'entraînement",
        scores: { Nain: 1, Guerrier: 2 },
      },
    ],
  },
  {
    question: "Comment réagis-tu face au danger ?",
    answers: [
      { text: "Avec agilité et ruse", scores: { Elfe: 2, Roublard: 1 } },
      {
        text: "Avec calme et réflexion",
        scores: { Halfelin: 2, Magicien: 1 },
      },
      { text: "Avec bravoure et force", scores: { Humain: 2, Guerrier: 1 } },
      {
        text: "Avec détermination et endurance",
        scores: { Nain: 2, Clerc: 1 },
      },
    ],
  },
  {
    question: "Quel est ton objectif de vie ?",
    answers: [
      { text: "Protéger la nature", scores: { Elfe: 2, Clerc: 1 } },
      {
        text: "Vivre en paix et en harmonie",
        scores: { Halfelin: 2, Barde: 1 },
      },
      { text: "Explorer et découvrir", scores: { Humain: 2, Roublard: 1 } },
      { text: "Forger et créer", scores: { Nain: 2, Magicien: 1 } },
    ],
  },
  {
    question: "Quel type de magie préfères-tu ?",
    answers: [
      { text: "La magie de la nature", scores: { Elfe: 2, Magicien: 1 } },
      {
        text: "La magie des illusions",
        scores: { Halfelin: 2, Roublard: 1 },
      },
      { text: "La magie des arcanes", scores: { Humain: 2, Magicien: 1 } },
      { text: "La magie des runes", scores: { Nain: 2, Magicien: 1 } },
    ],
  },
  {
    question: "Quel est ton style de combat ?",
    answers: [
      { text: "À distance avec un arc", scores: { Elfe: 2, Guerrier: 1 } },
      {
        text: "Avec des sorts et des enchantements",
        scores: { Halfelin: 2, Magicien: 1 },
      },
      {
        text: "Avec une épée et un bouclier",
        scores: { Humain: 2, Guerrier: 1 },
      },
      {
        text: "Avec une hache ou un marteau",
        scores: { Nain: 2, Guerrier: 1 },
      },
    ],
  },
  {
    question: "Quel est ton trait de caractère dominant ?",
    answers: [
      { text: "La sagesse", scores: { Elfe: 2, Clerc: 1 } },
      { text: "La chance", scores: { Halfelin: 2, Roublard: 1 } },
      { text: "La détermination", scores: { Humain: 2, Guerrier: 1 } },
      { text: "La résilience", scores: { Nain: 2, Guerrier: 1 } },
    ],
  },
  {
    question: "Quel est ton rôle préféré dans un groupe ?",
    answers: [
      { text: "Le protecteur", scores: { Elfe: 2, Clerc: 1 } },
      { text: "Le soutien", scores: { Halfelin: 2, Barde: 1 } },
      { text: "Le leader", scores: { Humain: 2, Guerrier: 1 } },
      { text: "Le combattant", scores: { Nain: 2, Guerrier: 1 } },
    ],
  },
];
