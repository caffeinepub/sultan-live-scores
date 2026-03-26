import { useNav, useTheme } from "../App";
import { LEAGUES } from "../data/mockData";

export default function LeaguesScreen() {
  const { dark } = useTheme();
  const { navigate } = useNav();

  const bg = dark ? "#0f1923" : "#f0f4f8";
  const cardBg = dark ? "#1a2535" : "#ffffff";

  return (
    <div style={{ backgroundColor: bg, minHeight: "100%" }}>
      {/* Header */}
      <div
        className="px-4 pt-12 pb-4"
        style={{ backgroundColor: dark ? "#0a1520" : "#ffffff" }}
      >
        <h1
          className="text-xl font-bold"
          style={{ color: dark ? "#ffffff" : "#1e293b" }}
        >
          Leagues
        </h1>
        <p className="text-xs mt-1" style={{ color: "#64748b" }}>
          All major competitions
        </p>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {LEAGUES.map((league) => (
          <button
            type="button"
            key={league.id}
            onClick={() => navigate({ type: "league-detail", league })}
            className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all active:scale-[0.98]"
            style={{
              backgroundColor: cardBg,
              border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"}`,
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{
                backgroundColor: `${league.color}22`,
                border: `1px solid ${league.color}44`,
              }}
            >
              {league.flag}
            </div>
            <div className="flex-1">
              <div
                className="font-semibold"
                style={{ color: dark ? "#ffffff" : "#1e293b" }}
              >
                {league.name}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                {league.country} • {league.season}
              </div>
            </div>
            <span style={{ color: "#64748b" }}>›</span>
          </button>
        ))}
      </div>
    </div>
  );
}
