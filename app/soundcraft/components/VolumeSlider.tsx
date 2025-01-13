interface VolumeSliderProps {
  effectId: string;
  volume: number;
  onChange: (effectId: string, volume: number) => void;
}

export function VolumeSlider({
  effectId,
  volume,
  onChange,
}: VolumeSliderProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={(e) => onChange(effectId, Number(e.target.value))}
        className="w-full appearance-none h-1.5 rounded-full bg-gray-700 accent-white/75 hover:accent-white transition-all cursor-pointer"
      />
    </div>
  );
}
