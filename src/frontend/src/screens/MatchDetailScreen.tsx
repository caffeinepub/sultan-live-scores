import { useState } from "react";
import { useNav, useTheme } from "../App";
import { MATCH_DETAIL } from "../data/mockData";
import type { Match, MatchEvent } from "../types";

type Tab = "summary" | "stats" | "lineups";

function StatBar({
  label,
  home,
  away,
  dark,
}: { label: string; home: number; away: number; dark: boolean }) {
  const total = home + away || 1;
  const homePct = (home / total) * 100;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs font-semibold">
        <span style={{ color: dark ? "#ffffff" : "#1e293b" }}>{home}</span>
        <span style={{ color: "#64748b" }}>{label}</span>
        <span style={{ color: dark ? "#ffffff" : "#1e293b" }}>{away}</span>
      </div>
      <div
        className="flex h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: dark ? "rgba(255,255,255,0.08)" : "#e2e8f0" }}
      >
        <div
          className="h-full rounded-full"
          style={{ width: `${homePct}%`, backgroundColor: "#00e676" }}
        />
        <div
          className="h-full rounded-full flex-1"
          style={{ backgroundColor: "#ef4444" }}
        />
      </div>
    </div>
  );
}

function EventIcon({ type }: { type: MatchEvent["type"] }) {
  const icons: Record<MatchEvent["type"], string> = {
    GOAL: "⚽",
    YELLOW_CARD: "🟨",
    RED_CARD: "🟥",
    SUBSTITUTION: "🔄",
    VAR: "📺",
    PENALTY: "⚽❗",
  };
  return <span className="text-base">{icons[type]}</span>;
}

export default function MatchDetailScreen({ match }: { match: Match }) {
  const { dark } = useTheme();
  const { goBack } = useNav();
  const [activeTab, setActiveTab] = useState<Tab>("summary");

  // Use mock detail for the first match, fallback to passed match
  const detail =
    match.id === MATCH_DETAIL.id
      ? MATCH_DETAIL
      : {
          ...match,
          events: [],
          stats: {
            possession: [50, 50] as [number, number],
            shots: [0, 0] as [number, number],
            shotsOnTarget: [0, 0] as [number, number],
            fouls: [0, 0] as [number, number],
            corners: [0, 0] as [number, number],
            offsides: [0, 0] as [number, number],
            yellowCards: [0, 0] as [number, number],
            redCards: [0, 0] as [number, number],
            passes: [0, 0] as [number, number],
            passAccuracy: [0, 0] as [number, number],
          },
          homeLineup: { formation: "4-4-2", starters: [], subs: [] },
          awayLineup: { formation: "4-4-2", starters: [], subs: [] },
          commentary: [],
        };

  const bg = dark ? "#0f1923" : "#f0f4f8";
  const cardBg = dark ? "#1a2535" : "#ffffff";

  const tabs: { id: Tab; label: string }[] = [
    { id: "summary", label: "Summary" },
    { id: "stats", label: "Stats" },
    { id: "lineups", label: "Lineups" },
  ];

  return (
    <div style={{ backgroundColor: bg, minHeight: "100%" }}>
      {/* Header */}
      <div style={{ backgroundColor: dark ? "#0a1520" : "#ffffff" }}>
        <div className="px-4 pt-12 pb-2">
          <button
            type="button"
            onClick={goBack}
            className="flex items-center gap-2 mb-4"
          >
            <span style={{ color: "#00e676" }}>←</span>
            <span className="text-sm" style={{ color: "#00e676" }}>
              Back
            </span>
          </button>

          {/* Match header */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs" style={{ color: "#64748b" }}>
              {match.leagueFlag} {match.leagueName}
            </span>
            {match.status === "LIVE" && (
              <span
                className="flex items-center gap-1 text-xs font-bold"
                style={{ color: "#ef4444" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-live" />
                LIVE {match.minute}'
              </span>
            )}
            {match.status === "FINISHED" && (
              <span className="text-xs" style={{ color: "#64748b" }}>
                FT
              </span>
            )}
            {match.status === "HT" && (
              <span className="text-xs font-bold" style={{ color: "#f59e0b" }}>
                HT
              </span>
            )}
          </div>

          <div className="flex items-center justify-between py-2">
            <div
              className="flex flex-col items-center gap-2"
              style={{ width: 100 }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                style={{
                  backgroundColor: `${match.homeTeam.color}22`,
                  border: `2px solid ${match.homeTeam.color}44`,
                }}
              >
                {match.homeTeam.crest}
              </div>
              <span
                className="text-sm font-semibold text-center"
                style={{ color: dark ? "#ffffff" : "#1e293b" }}
              >
                {match.homeTeam.name}
              </span>
            </div>

            {match.status !== "UPCOMING" ? (
              <div className="flex items-center gap-3">
                <span
                  className="text-4xl font-bold"
                  style={{ color: dark ? "#ffffff" : "#1e293b" }}
                >
                  {match.homeScore}
                </span>
                <span style={{ color: "#475569" }}>-</span>
                <span
                  className="text-4xl font-bold"
                  style={{ color: dark ? "#ffffff" : "#1e293b" }}
                >
                  {match.awayScore}
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold" style={{ color: "#64748b" }}>
                vs
              </span>
            )}

            <div
              className="flex flex-col items-center gap-2"
              style={{ width: 100 }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                style={{
                  backgroundColor: `${match.awayTeam.color}22`,
                  border: `2px solid ${match.awayTeam.color}44`,
                }}
              >
                {match.awayTeam.crest}
              </div>
              <span
                className="text-sm font-semibold text-center"
                style={{ color: dark ? "#ffffff" : "#1e293b" }}
              >
                {match.awayTeam.name}
              </span>
            </div>
          </div>

          {match.venue && (
            <div className="text-center pb-2">
              <span className="text-xs" style={{ color: "#64748b" }}>
                🏟 {match.venue}
              </span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div
          className="flex"
          style={{
            borderTop: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
          }}
        >
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-3 text-sm font-medium"
              style={{
                color: activeTab === tab.id ? "#00e676" : "#64748b",
                borderBottom:
                  activeTab === tab.id
                    ? "2px solid #00e676"
                    : "2px solid transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {/* Summary */}
        {activeTab === "summary" && (
          <div className="flex flex-col gap-3">
            {detail.events.length > 0 ? (
              <div
                className="rounded-xl overflow-hidden"
                style={{ backgroundColor: cardBg }}
              >
                {detail.events.map((event, i) => (
                  <div
                    key={event.id}
                    className="flex items-center px-4 py-3"
                    style={{
                      borderBottom:
                        i < detail.events.length - 1
                          ? `1px solid ${dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)"}`
                          : "none",
                    }}
                  >
                    {event.team === "home" ? (
                      <>
                        <div className="flex-1">
                          <span
                            className="text-sm font-medium"
                            style={{ color: dark ? "#e2e8f0" : "#1e293b" }}
                          >
                            {event.player}
                          </span>
                          {event.detail && (
                            <span
                              className="text-xs ml-1"
                              style={{ color: "#64748b" }}
                            >
                              {event.detail}
                            </span>
                          )}
                        </div>
                        <span
                          className="text-xs mx-3"
                          style={{ color: "#64748b" }}
                        >
                          {event.minute}'
                        </span>
                        <EventIcon type={event.type} />
                        <div className="w-16" />
                      </>
                    ) : (
                      <>
                        <div className="w-16" />
                        <EventIcon type={event.type} />
                        <span
                          className="text-xs mx-3"
                          style={{ color: "#64748b" }}
                        >
                          {event.minute}'
                        </span>
                        <div className="flex-1 text-right">
                          <span
                            className="text-sm font-medium"
                            style={{ color: dark ? "#e2e8f0" : "#1e293b" }}
                          >
                            {event.player}
                          </span>
                          {event.detail && (
                            <span
                              className="text-xs ml-1"
                              style={{ color: "#64748b" }}
                            >
                              {event.detail}
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8" style={{ color: "#64748b" }}>
                No events yet
              </div>
            )}

            {/* Commentary */}
            {detail.commentary && detail.commentary.length > 0 && (
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
                    Live Commentary
                  </span>
                </div>
                {detail.commentary.map((comment, i) => (
                  <div
                    key={comment.slice(0, 20)}
                    className="px-4 py-2.5 text-xs"
                    style={{
                      color: dark ? "#94a3b8" : "#475569",
                      borderBottom:
                        i < detail.commentary.length - 1
                          ? `1px solid ${dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`
                          : "none",
                    }}
                  >
                    {comment}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        {activeTab === "stats" && (
          <div
            className="rounded-xl p-4 flex flex-col gap-4"
            style={{ backgroundColor: cardBg }}
          >
            <div className="flex justify-between text-xs font-bold mb-1">
              <span style={{ color: "#00e676" }}>
                {match.homeTeam.shortName}
              </span>
              <span style={{ color: "#64748b" }}>STATS</span>
              <span style={{ color: "#ef4444" }}>
                {match.awayTeam.shortName}
              </span>
            </div>
            <StatBar
              label="Possession %"
              home={detail.stats.possession[0]}
              away={detail.stats.possession[1]}
              dark={dark}
            />
            <StatBar
              label="Shots"
              home={detail.stats.shots[0]}
              away={detail.stats.shots[1]}
              dark={dark}
            />
            <StatBar
              label="Shots on Target"
              home={detail.stats.shotsOnTarget[0]}
              away={detail.stats.shotsOnTarget[1]}
              dark={dark}
            />
            <StatBar
              label="Fouls"
              home={detail.stats.fouls[0]}
              away={detail.stats.fouls[1]}
              dark={dark}
            />
            <StatBar
              label="Corners"
              home={detail.stats.corners[0]}
              away={detail.stats.corners[1]}
              dark={dark}
            />
            <StatBar
              label="Offsides"
              home={detail.stats.offsides[0]}
              away={detail.stats.offsides[1]}
              dark={dark}
            />
            <StatBar
              label="Yellow Cards"
              home={detail.stats.yellowCards[0]}
              away={detail.stats.yellowCards[1]}
              dark={dark}
            />
            <StatBar
              label="Passes"
              home={detail.stats.passes[0]}
              away={detail.stats.passes[1]}
              dark={dark}
            />
            <StatBar
              label="Pass Accuracy %"
              home={detail.stats.passAccuracy[0]}
              away={detail.stats.passAccuracy[1]}
              dark={dark}
            />
          </div>
        )}

        {/* Lineups */}
        {activeTab === "lineups" && (
          <div className="flex flex-col gap-4">
            {/* Formation */}
            <div className="rounded-xl p-4" style={{ backgroundColor: cardBg }}>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs" style={{ color: "#64748b" }}>
                    {match.homeTeam.name}
                  </div>
                  <div
                    className="text-lg font-bold"
                    style={{ color: "#00e676" }}
                  >
                    {detail.homeLineup.formation}
                  </div>
                </div>
                <div className="text-sm" style={{ color: "#64748b" }}>
                  Formation
                </div>
                <div className="text-right">
                  <div className="text-xs" style={{ color: "#64748b" }}>
                    {match.awayTeam.name}
                  </div>
                  <div
                    className="text-lg font-bold"
                    style={{ color: "#ef4444" }}
                  >
                    {detail.awayLineup.formation}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Home starters */}
              <div
                className="rounded-xl overflow-hidden"
                style={{ backgroundColor: cardBg }}
              >
                <div
                  className="px-3 py-2"
                  style={{
                    backgroundColor: "#00e67620",
                    borderBottom: "1px solid #00e67630",
                  }}
                >
                  <span
                    className="text-xs font-bold"
                    style={{ color: "#00e676" }}
                  >
                    {match.homeTeam.shortName} XI
                  </span>
                </div>
                {detail.homeLineup.starters.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-2 px-3 py-1.5"
                    style={{
                      borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
                    }}
                  >
                    <span
                      className="text-[10px] font-bold w-5 text-center"
                      style={{ color: "#64748b" }}
                    >
                      {p.number}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: dark ? "#e2e8f0" : "#1e293b" }}
                    >
                      {p.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Away starters */}
              <div
                className="rounded-xl overflow-hidden"
                style={{ backgroundColor: cardBg }}
              >
                <div
                  className="px-3 py-2"
                  style={{
                    backgroundColor: "#ef444420",
                    borderBottom: "1px solid #ef444430",
                  }}
                >
                  <span
                    className="text-xs font-bold"
                    style={{ color: "#ef4444" }}
                  >
                    {match.awayTeam.shortName} XI
                  </span>
                </div>
                {detail.awayLineup.starters.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-2 px-3 py-1.5"
                    style={{
                      borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
                    }}
                  >
                    <span
                      className="text-[10px] font-bold w-5 text-center"
                      style={{ color: "#64748b" }}
                    >
                      {p.number}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: dark ? "#e2e8f0" : "#1e293b" }}
                    >
                      {p.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
