interface ScoreIndicatorProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export function ScoreIndicator({ score, size = "md" }: ScoreIndicatorProps) {
  const getColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-blue-600 bg-blue-50";
    if (score >= 40) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getSize = () => {
    if (size === "sm") return "w-12 h-12 text-sm";
    if (size === "lg") return "w-20 h-20 text-2xl";
    return "w-16 h-16 text-xl";
  };

  return (
    <div
      className={`${getSize()} ${getColor(
        score
      )} rounded-full flex items-center justify-center font-semibold`}
    >
      {score}
    </div>
  );
}
