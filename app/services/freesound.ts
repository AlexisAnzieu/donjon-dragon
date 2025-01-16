import { ImportedSound } from "@/app/soundcraft/effects";
import { Sound } from "@prisma/client";

const FREESOUND_API_URL = "https://freesound.org/apiv2";
const API_KEY = process.env.NEXT_PUBLIC_FREESOUND_API_KEY;

export async function searchFreesound(query: string): Promise<Sound[]> {
  if (!query) return [];

  try {
    const response = await fetch(
      `${FREESOUND_API_URL}/search/text/?query=${encodeURIComponent(
        query
      )}&token=${API_KEY}&fields=id,name,previews,duration,tags,images&page_size=20`
    );
    const data = await response.json();

    return data.results.map((sound: ImportedSound) => ({
      id: sound.id.toString(),
      label: sound.name,
      category: sound.tags?.[0] || "Uncategorized",
      url: sound.previews["preview-hq-mp3"],
      volume: 1,
      duration: sound.duration || 0,
      loop: false,
      waveformUrl: sound.images.waveform_l,
    }));
  } catch (error) {
    console.error("Failed to fetch from Freesound:", error);
    return [];
  }
}
