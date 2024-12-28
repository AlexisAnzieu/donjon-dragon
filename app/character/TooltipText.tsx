interface TooltipTextProps {
  text: string;
  children: React.ReactNode;
}

export default function TooltipText({ text, children }: TooltipTextProps) {
  return (
    <span className="group">
      <span className="text-blue-600 font-semibold cursor-help border-b border-dotted border-blue-600">
        {text}
      </span>
      <span className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition text-white p-2 rounded fixed bottom-4 right-4 text-sm z-10 max-w-3xl">
        <div className="bg-white text-black  p-6 border-2 border-blue-600 rounded-xl min-w-[250px] z-50">
          {children}
        </div>
      </span>
    </span>
  );
}
