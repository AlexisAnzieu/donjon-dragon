export default function Stats({ bonus }: { bonus?: string }) {
  const stats = [
    {
      label: "Force",
      description: "Puissance physique et combat au corps à corps",
      icon: "💪",
    },
    {
      label: "Dextérité",
      description: "Agilité, réflexes et précision",
      icon: "🏃‍♂️",
    },
    {
      label: "Constitution",
      description: "Endurance et résistance physique",
      icon: "🛡️",
    },
    {
      label: "Intelligence",
      description: "Raisonnement, mémoire et connaissances",
      icon: "🧠",
    },
    {
      label: "Sagesse",
      description: "Perception, intuition et volonté",
      icon: "🦉",
    },
    {
      label: "Charisme",
      description: "Force de personnalité et leadership",
      icon: "🎭",
    },
  ];

  return (
    <div className="bg-white p-6 border-2 border-blue-600 rounded-xl">
      <ul className="grid grid-cols-3 gap-6">
        {stats.map((stat) => (
          <li
            key={stat.label}
            className={`p-4 rounded-lg transition-all duration-300 ${
              bonus === stat.label ? "bg-gray-300 shadow-lg" : "bg-gray-100"
            }`}
          >
            <div className="flex items-center space-x-4">
              <span className="text-3xl" role="img" aria-label={stat.label}>
                {stat.icon}
              </span>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {stat.label}
                </h3>
                <p className="text-sm mt-1 text-gray-700">{stat.description}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
