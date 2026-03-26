import { useEffect, useState } from "react";
import { useNav, useTheme } from "../App";
import MatchCard from "../components/MatchCard";
import { Skeleton } from "../components/ui/skeleton";
import {
  LIVE_MATCHES,
  RECENT_RESULTS,
  STANDINGS_BY_LEAGUE,
  UPCOMING_MATCHES,
} from "../data/mockData";
import { useApiKey } from "../hooks/useApiKey";
import { fetchLeagueMatches, fetchStandings } from "../services/footballApi";
import type { League, Match, Standing } from "../types";

type Tab = "fixtures" | "results" | "standings";

function StandingsRow({
  s,
  dark,
  isLast,
}: { s: Standing; dark: boolean; isLast: boolean }) {
  const championsZone = s.rank <= 4;
  const euroZone = s.rank > 4 && s.rank <= 6;
  const relegationZone = s.rank >= 18;

  const borderLeft = championsZone
    ? "#00e676"
    : euroZone
      ? "#f59e0b"
      : relegationZone
        ? "#ef4444"
        : "transparent";

  return (
    <div
      className="flex items-center px-3 py-2"
      style={{
        borderBottom: isLast
          ? "none"
          : `1px solid ${dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)"}`,
        borderLeft: `3px solid ${borderLeft}`,
      }}
    >
      <span className="w-7 text-xs text-center" style={{ color: "#64748b" }}>
        {s.rank}
      </span>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-sm">
          {s.team.crest.startsWith("http") ? (
            <img
              src={s.team.crest}
              alt={s.team.shortName}
              className="w-5 h-5 object-contain"
            />
          ) : (
            s.team.crest
          )}
        </span>
        <span
          className="text-xs font-medium truncate"
          style={{ color: dark ? "#e2e8f0" : "#1e293b" }}
        >
          {s.team.name}
        </span>
      </div>
      <div className="flex gap-3 text-xs" style={{ color: "#64748b" }}>
        <span className="w-5 text-center">{s.played}</span>
        <span className="w-5 text-center">{s.won}</span>
        <span className="w-5 text-center">{s.drawn}</span>
        <span className="w-5 text-center">{s.lost}</span>
        <span className="w-7 text-center">
          {s.goalDiff > 0 ? "+" : ""}
          {s.goalDiff}
        </span>
        <span
          className="w-6 text-center font-bold"
          style={{ color: dark ? "#ffffff" : "#1e293b" }}
        >
          {s.points}
        </span>
      </div>
    </div>
  );
}

export default function LeagueDetailScreen({ league }: { league: League }) {
  const { dark } = useTheme();
  const { goBack } = useNav();
  const { apiKey } = useApiKey();
  const [activeTab, setActiveTab] = useState<Tab>("standings");

  const [apiStandings, setApiStandings] = useState<Standing[]>([]);
  const [apiMatches, setApiMatches] = useState<Match[]>([]);
  const [loadingStandings, setLoadingStandings] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [standingsError, setStandingsError] = useState<string | null>(null);
  const [matchesError, setMatchesError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiKey) return;

    async function loadStandings() {
      setLoadingStandings(true);
      setStandingsError(null);
      try {
        const data = await fetchStandings(apiKey, league.id);
        setApiStandings(data);
      } catch (e) {
        setStandingsError(
          e instanceof Error ? e.message : "Failed to load standings",
        );
      } finally {
        setLoadingStandings(false);
      }
    }

    async function loadMatches() {
      setLoadingMatches(true);
      setMatchesError(null);
      try {
        const data = await fetchLeagueMatches(apiKey, league.id);
        setApiMatches(data);
      } catch (e) {
        setMatchesError(
          e instanceof Error ? e.message : "Failed to load matches",
        );
      } finally {
        setLoadingMatches(false);
      }
    }

    loadStandings();
    loadMatches();

    const interval = setInterval(() => {
      loadStandings();
      loadMatches();
    }, 60000);
    return () => clearInterval(interval);
  }, [apiKey, league.id]);

  const bg = dark ? "#0f1923" : "#f0f4f8";
  const cardBg = dark ? "#1a2535" : "#ffffff";

  // Use API data if available, fall back to mock
  const standings = apiKey
    ? apiStandings
    : STANDINGS_BY_LEAGUE[league.id] || [];
  const mockFixtures = UPCOMING_MATCHES.filter((m) => m.leagueId === league.id);
  const mockResults = RECENT_RESULTS.filter((m) => m.leagueId === league.id);
  const mockLive = LIVE_MATCHES.filter((m) => m.leagueId === league.id);

  const fixtures = apiKey
    ? apiMatches.filter(
        (m) =>
          m.status === "UPCOMING" || m.status === "LIVE" || m.status === "HT",
      )
    : [...mockLive, ...mockFixtures];
  const results = apiKey
    ? apiMatches.filter((m) => m.status === "FINISHED")
    : mockResults;

  const tabs: { id: Tab; label: string }[] = [
    { id: "standings", label: "Standings" },
    { id: "fixtures", label: "Fixtures" },
    { id: "results", label: "Results" },
  ];

  return (
    <div style={{ backgroundColor: bg, minHeight: "100%" }}>
      {/* Header */}
      <div
        className="px-4 pt-12 pb-3"
        style={{ backgroundColor: dark ? "#0a1520" : "#ffffff" }}
      >
        <button
          type="button"
          onClick={goBack}
          className="flex items-center gap-2 mb-3"
          data-ocid="league.button"
        >
          <span style={{ color: "#00e676" }}>←</span>
          <span className="text-sm" style={{ color: "#00e676" }}>
            Back
          </span>
        </button>
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${league.color}22` }}
          >
            {league.flag}
          </div>
          <div>
            <h1
              className="text-lg font-bold"
              style={{ color: dark ? "#ffffff" : "#1e293b" }}
            >
              {league.name}
            </h1>
            <p className="text-xs" style={{ color: "#64748b" }}>
              {league.country} • {league.season}
              {apiKey && <span style={{ color: "#00e676" }}> • Live</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex"
        style={{
          backgroundColor: dark ? "#0a1520" : "#ffffff",
          borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"}`,
        }}
      >
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 py-3 text-sm font-medium transition-all"
            style={{
              color: activeTab === tab.id ? "#00e676" : "#64748b",
              borderBottom:
                activeTab === tab.id
                  ? "2px solid #00e676"
                  : "2px solid transparent",
            }}
            data-ocid="league.tab"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {/* Standings */}
        {activeTab === "standings" && (
          <>
            {loadingStandings && (
              <div
                className="flex flex-col gap-2"
                data-ocid="league.loading_state"
              >
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-10 w-full rounded" />
                ))}
              </div>
            )}
            {standingsError && (
              <div
                className="px-4 py-3 rounded-xl text-sm mb-3"
                style={{
                  backgroundColor: dark ? "#2a0f0f" : "#fef2f2",
                  color: "#ef4444",
                }}
                data-ocid="league.error_state"
              >
                ⚠️ {standingsError}
              </div>
            )}
            {!loadingStandings && standings.length > 0 && (
              <div
                className="rounded-xl overflow-hidden"
                style={{ backgroundColor: cardBg }}
              >
                <div
                  className="flex items-center px-3 py-2"
                  style={{
                    borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)"}`,
                  }}
                >
                  <span className="w-7" />
                  <span
                    className="flex-1 text-xs font-bold"
                    style={{ color: "#64748b" }}
                  >
                    TEAM
                  </span>
                  <div
                    className="flex gap-3 text-[10px] font-bold"
                    style={{ color: "#64748b" }}
                  >
                    <span className="w-5 text-center">P</span>
                    <span className="w-5 text-center">W</span>
                    <span className="w-5 text-center">D</span>
                    <span className="w-5 text-center">L</span>
                    <span className="w-7 text-center">GD</span>
                    <span className="w-6 text-center">PTS</span>
                  </div>
                </div>
                {standings.map((s, i) => (
                  <StandingsRow
                    key={s.team.id}
                    s={s}
                    dark={dark}
                    isLast={i === standings.length - 1}
                  />
                ))}
                <div
                  className="px-3 py-3 flex gap-4 flex-wrap"
                  style={{
                    borderTop: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"}`,
                  }}
                >
                  {[
                    { color: "#00e676", label: "Champions League" },
                    { color: "#f59e0b", label: "Europa League" },
                    { color: "#ef4444", label: "Relegation" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span
                        className="text-[10px]"
                        style={{ color: "#64748b" }}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Fixtures */}
        {activeTab === "fixtures" && (
          <div className="flex flex-col gap-2">
            {loadingMatches && (
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
              </div>
            )}
            {matchesError && (
              <div
                className="px-4 py-3 rounded-xl text-sm"
                style={{
                  backgroundColor: dark ? "#2a0f0f" : "#fef2f2",
                  color: "#ef4444",
                }}
              >
                ⚠️ {matchesError}
              </div>
            )}
            {!loadingMatches && fixtures.length > 0
              ? fixtures.map((m) => <MatchCard key={m.id} match={m} />)
              : !loadingMatches && (
                  <div
                    className="text-center py-12"
                    style={{ color: "#64748b" }}
                  >
                    No upcoming fixtures
                  </div>
                )}
          </div>
        )}

        {/* Results */}
        {activeTab === "results" && (
          <div className="flex flex-col gap-2">
            {loadingMatches && (
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
              </div>
            )}
            {matchesError && (
              <div
                className="px-4 py-3 rounded-xl text-sm"
                style={{
                  backgroundColor: dark ? "#2a0f0f" : "#fef2f2",
                  color: "#ef4444",
                }}
              >
                ⚠️ {matchesError}
              </div>
            )}
            {!loadingMatches && results.length > 0
              ? results.map((m) => <MatchCard key={m.id} match={m} />)
              : !loadingMatches && (
                  <div
                    className="text-center py-12"
                    style={{ color: "#64748b" }}
                  >
                    No recent results
                  </div>
                )}
          </div>
        )}
      </div>
    </div>
  );
}
