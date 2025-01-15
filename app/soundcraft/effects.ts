export interface Effect {
  id: string;
  label: string;
  category: string;
  url: string;
  volume: number;
  duration: number;
  loop: boolean;
}

export interface Sound {
  id: number;
  name: string;
  previews: {
    "preview-hq-mp3": string;
    "preview-lq-mp3": string;
    "preview-hq-ogg": string;
    "preview-lq-ogg": string;
  };
  duration: number;
  tags: string[];
}

// No more local effects export
export const effects: Effect[] = [];
