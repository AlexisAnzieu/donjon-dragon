import { ImportedSound } from "@/app/soundcraft/effects";
import { Sound } from "@prisma/client";

const FREESOUND_API_URL = "https://freesound.org/apiv2";
const API_KEY = process.env.NEXT_PUBLIC_FREESOUND_API_KEY;

export async function searchFreesound(
  query: string,
  minDuration?: number,
  maxDuration?: number | null,
  pageSize: number = 20
): Promise<Sound[]> {
  if (!query) return [];

  try {
    if (!API_KEY) {
      throw new Error("Freesound API key is not configured");
    }

    const validatedPageSize = Math.min(Math.max(1, pageSize), 100);

    const params = new URLSearchParams({
      query: query,
      token: API_KEY,
      fields: "id,name,previews,duration,tags,images",
      page_size: validatedPageSize.toString(),
    });

    if (
      minDuration !== undefined &&
      maxDuration !== undefined &&
      maxDuration !== null
    ) {
      params.append("filter", `duration:[${minDuration} TO ${maxDuration}]`);
    } else if (minDuration !== undefined) {
      params.append("filter", `duration:[${minDuration} TO *]`);
    } else if (maxDuration !== undefined && maxDuration !== null) {
      params.append("filter", `duration:[0 TO ${maxDuration}]`);
    }

    const url = `${FREESOUND_API_URL}/search/text/?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Freesound API error: ${response.statusText}`);
    }

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
