interface BrushPreviewProps {
  size: number;
  mousePosition: { x: number; y: number };
  zoom?: number;
}

export const BrushPreview = ({
  size,
  mousePosition,
  zoom = 1,
}: BrushPreviewProps) => {
  if (!mousePosition) return null;

  const scaledSize = size * zoom;

  return (
    <div
      className="pointer-events-none fixed z-50 border-2 border-gray-500/50 bg-gray-500/40 rounded-full"
      style={{
        width: scaledSize * 2,
        height: scaledSize * 2,
        transform: `translate(${mousePosition.x - scaledSize}px, ${
          mousePosition.y - scaledSize
        }px)`,
      }}
    />
  );
};
