interface Question {
  question: string;
  answers: {
    text: string;
    scores: Record<string, number>;
  }[];
}

export const questions: Question[] = [
  {
    question: "Comment préfères-tu passer ton week-end ?",
    answers: [
      {
        text: "Randonnée et photographie nature",
        scores: { Elfe: 1, Clerc: 1 },
      },
      {
        text: "Dans un café à partager des anecdotes",
        scores: { Halfelin: 1, Barde: 1 },
      },
      {
        text: "À explorer des quartiers inconnus",
        scores: { Humain: 1, Roublard: 1 },
      },
      { text: "Dans mon atelier à bricoler", scores: { Nain: 1, Guerrier: 1 } },
    ],
  },
  {
    question: "Quel serait ton métier de rêve ?",
    answers: [
      {
        text: "Chercheur en développement durable",
        scores: { Elfe: 1, Magicien: 1 },
      },
      { text: "Détective privé", scores: { Halfelin: 1, Roublard: 1 } },
      {
        text: "Influenceur sur les réseaux sociaux",
        scores: { Humain: 1, Barde: 1 },
      },
      { text: "Coach sportif", scores: { Nain: 1, Guerrier: 1 } },
    ],
  },
  {
    question: "Face à un conflit au travail, tu...",
    answers: [
      {
        text: "Analyses calmement la situation",
        scores: { Elfe: 1, Guerrier: 1 },
      },
      {
        text: "Cherches à médier et apaiser",
        scores: { Halfelin: 1, Clerc: 1 },
      },
      {
        text: "Proposes des solutions innovantes",
        scores: { Humain: 1, Magicien: 1 },
      },
      { text: "Négocies habilement", scores: { Nain: 1, Roublard: 1 } },
    ],
  },
  {
    question: "Où préfères-tu vivre ?",
    answers: [
      {
        text: "Dans un éco-village en périphérie",
        scores: { Elfe: 1, Barde: 1 },
      },
      {
        text: "Dans un loft historique rénové",
        scores: { Halfelin: 1, Magicien: 1 },
      },
      { text: "En plein centre-ville", scores: { Humain: 1, Clerc: 1 } },
      {
        text: "Dans une maison que tu as rénovée",
        scores: { Nain: 1, Guerrier: 1 },
      },
    ],
  },
  {
    question: "Quelle est ton approche des nouvelles technologies ?",
    answers: [
      { text: "Expert en cybersécurité", scores: { Elfe: 1, Roublard: 1 } },
      {
        text: "Développeur d'applications innovantes",
        scores: { Halfelin: 1, Magicien: 1 },
      },
      {
        text: "Spécialiste en intelligence artificielle",
        scores: { Humain: 1, Guerrier: 1 },
      },
      {
        text: "Consultant en transformation digitale",
        scores: { Nain: 1, Clerc: 1 },
      },
    ],
  },
  {
    question: "Comment gères-tu tes projets d'équipe ?",
    answers: [
      { text: "En favorisant la communication", scores: { Elfe: 1, Barde: 1 } },
      {
        text: "En trouvant des solutions créatives",
        scores: { Halfelin: 1, Roublard: 1 },
      },
      {
        text: "En guidant avec bienveillance",
        scores: { Humain: 1, Clerc: 1 },
      },
      { text: "En optimisant les processus", scores: { Nain: 1, Magicien: 1 } },
    ],
  },
  {
    question: "Quel est ton objectif professionnel ?",
    answers: [
      {
        text: "Créer une entreprise éco-responsable",
        scores: { Elfe: 1, Clerc: 1 },
      },
      {
        text: "Devenir un leader inspirant",
        scores: { Halfelin: 1, Guerrier: 1 },
      },
      { text: "Innover dans ton domaine", scores: { Humain: 1, Magicien: 1 } },
      {
        text: "Développer un réseau international",
        scores: { Nain: 1, Roublard: 1 },
      },
    ],
  },
  {
    question: "Comment passes-tu tes soirées idéales ?",
    answers: [
      { text: "Yoga et méditation", scores: { Elfe: 1, Magicien: 1 } },
      { text: "Karaoké entre amis", scores: { Halfelin: 1, Barde: 1 } },
      {
        text: "Session de sport ou CrossFit",
        scores: { Humain: 1, Guerrier: 1 },
      },
      { text: "Organisation d'événements", scores: { Nain: 1, Barde: 1 } },
    ],
  },
  {
    question: "Quelle est ta plus grande qualité professionnelle ?",
    answers: [
      { text: "L'empathie et l'écoute", scores: { Elfe: 1, Clerc: 1 } },
      { text: "L'adaptabilité", scores: { Halfelin: 1, Roublard: 1 } },
      { text: "Le charisme", scores: { Humain: 1, Barde: 1 } },
      { text: "La détermination", scores: { Nain: 1, Guerrier: 1 } },
    ],
  },
  {
    question: "Quel type de projet te passionne ?",
    answers: [
      { text: "Les projets de recherche", scores: { Elfe: 1, Magicien: 1 } },
      {
        text: "Les start-ups innovantes",
        scores: { Halfelin: 1, Roublard: 1 },
      },
      { text: "Les défis sportifs", scores: { Humain: 1, Guerrier: 1 } },
      { text: "L'accompagnement d'équipes", scores: { Nain: 1, Clerc: 1 } },
    ],
  },
];
