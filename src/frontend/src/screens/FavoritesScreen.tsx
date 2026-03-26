import { useEffect, useState } from "react";
import { useTheme } from "../App";
import MatchCard from "../components/MatchCard";
import { LEAGUES, LIVE_MATCHES, UPCOMING_MATCHES } from "../data/mockData";

const ALL_TEAMS = [
  { id: "mci", name: "Man City", crest: "🔵", leagueId: "PL" },
  { id: "ars", name: "Arsenal", crest: "🔴", leagueId: "PL" },
  { id: "liv", name: "Liverpool", crest: "🔴", leagueId: "PL" },
  { id: "che", name: "Chelsea", crest: "🔵", leagueId: "PL" },
  { id: "mun", name: "Man United", crest: "🔴", leagueId: "PL" },
  { id: "rma", name: "Real Madrid", crest: "⚪", leagueId: "PD" },
  { id: "bar", name: "Barcelona", crest: "🔵", leagueId: "PD" },
  { id: "atm", name: "Atletico Madrid", crest: "🔴", leagueId: "PD" },
  { id: "bay", name: "Bayern Munich", crest: "🔴", leagueId: "BL1" },
  { id: "dor", name: "Dortmund", crest: "🟡", leagueId: "BL1" },
  { id: "int", name: "Inter Milan", crest: "⚫", leagueId: "SA" },
  { id: "juv", name: "Juventus", crest: "⚪", leagueId: "SA" },
  { id: "acm", name: "AC Milan", crest: "🔴", leagueId: "SA" },
  { id: "nap", name: "Napoli", crest: "🔵", leagueId: "SA" },
];

export default function FavoritesScreen() {
  const { dark } = useTheme();
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {
      return [];
    }
  });
  const [showAddTeams, setShowAddTeams] = useState(false);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const toggleFavorite = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  const favoriteTeams = ALL_TEAMS.filter((t) => favoriteIds.includes(t.id));
  const favoriteMatches = [...LIVE_MATCHES, ...UPCOMING_MATCHES].filter(
    (m) =>
      favoriteIds.includes(m.homeTeam.id) ||
      favoriteIds.includes(m.awayTeam.id),
  );

  const bg = dark ? "#0f1923" : "#f0f4f8";
  const cardBg = dark ? "#1a2535" : "#ffffff";

  return (
    <div style={{ backgroundColor: bg, minHeight: "100%" }}>
      <div
        className="px-4 pt-12 pb-4 flex items-center justify-between"
        style={{ backgroundColor: dark ? "#0a1520" : "#ffffff" }}
      >
        <div>
          <h1
            className="text-xl font-bold"
            style={{ color: dark ? "#ffffff" : "#1e293b" }}
          >
            Favorites
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
            Your followed teams
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddTeams((s) => !s)}
          className="px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: "#00e67620",
            color: "#00e676",
            border: "1px solid #00e67640",
          }}
        >
          {showAddTeams ? "Done" : "+ Follow Teams"}
        </button>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Follow teams panel */}
        {showAddTeams && (
          <div
            className="rounded-xl overflow-hidden"
            style={{ backgroundColor: cardBg }}
          >
            <div
              className="px-4 py-3"
              style={{
                borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
              }}
            >
              <span
                className="text-sm font-bold"
                style={{ color: dark ? "#e2e8f0" : "#1e293b" }}
              >
                Choose teams to follow
              </span>
            </div>
            <div className="flex flex-col">
              {ALL_TEAMS.map((team, i) => {
                const isFollowed = favoriteIds.includes(team.id);
                return (
                  <button
                    type="button"
                    key={team.id}
                    onClick={() => toggleFavorite(team.id)}
                    className="flex items-center justify-between px-4 py-3"
                    style={{
                      borderBottom:
                        i < ALL_TEAMS.length - 1
                          ? `1px solid ${dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`
                          : "none",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{team.crest}</span>
                      <div>
                        <div
                          className="text-sm font-medium text-left"
                          style={{ color: dark ? "#e2e8f0" : "#1e293b" }}
                        >
                          {team.name}
                        </div>
                        <div
                          className="text-[10px]"
                          style={{ color: "#64748b" }}
                        >
                          {LEAGUES.find((l) => l.id === team.leagueId)?.name}
                        </div>
                      </div>
                    </div>
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: isFollowed ? "#00e676" : "transparent",
                        border: `2px solid ${isFollowed ? "#00e676" : "#475569"}`,
                      }}
                    >
                      {isFollowed && (
                        <span className="text-[10px] text-black font-bold">
                          ✓
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Followed teams */}
        {!showAddTeams && favoriteTeams.length > 0 && (
          <div>
            <div
              className="text-xs font-bold mb-2 px-1"
              style={{ color: "#64748b" }}
            >
              FOLLOWING
            </div>
            <div className="flex flex-wrap gap-2">
              {favoriteTeams.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-full"
                  style={{
                    backgroundColor: cardBg,
                    border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                  }}
                >
                  <span>{team.crest}</span>
                  <span
                    className="text-xs font-medium"
                    style={{ color: dark ? "#e2e8f0" : "#1e293b" }}
                  >
                    {team.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(team.id)}
                    style={{ color: "#64748b" }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Matches involving favorites */}
        {!showAddTeams && favoriteMatches.length > 0 && (
          <div>
            <div
              className="text-xs font-bold mb-2 px-1"
              style={{ color: "#64748b" }}
            >
              MATCHES
            </div>
            <div className="flex flex-col gap-2">
              {favoriteMatches.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!showAddTeams && favoriteTeams.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <span className="text-5xl">⭐</span>
            <div className="text-center">
              <div
                className="font-semibold"
                style={{ color: dark ? "#ffffff" : "#1e293b" }}
              >
                No favorites yet
              </div>
              <div className="text-sm mt-1" style={{ color: "#64748b" }}>
                Follow your favorite teams to get quick updates
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowAddTeams(true)}
              className="px-6 py-2.5 rounded-full text-sm font-semibold"
              style={{ backgroundColor: "#00e676", color: "#0a1520" }}
            >
              Follow Teams
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
