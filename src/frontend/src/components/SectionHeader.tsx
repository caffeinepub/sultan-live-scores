import { useTheme } from "../App";

export default function SectionHeader({
  title,
  count,
}: { title: string; count?: number }) {
  const { dark } = useTheme();
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <span
        className="text-sm font-bold"
        style={{ color: dark ? "#e2e8f0" : "#1e293b" }}
      >
        {title}
      </span>
      {count !== undefined && (
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
          style={{ backgroundColor: "#00e67620", color: "#00e676" }}
        >
          {count}
        </span>
      )}
    </div>
  );
}
