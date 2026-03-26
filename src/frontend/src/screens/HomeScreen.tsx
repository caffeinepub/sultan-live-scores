import { useEffect, useRef, useState } from "react";
import { useTheme } from "../App";
import { useNav } from "../App";
import MatchCard from "../components/MatchCard";
import SectionHeader from "../components/SectionHeader";
import { Skeleton } from "../components/ui/skeleton";
import {
  LEAGUES,
  LIVE_MATCHES,
  RECENT_RESULTS,
  UPCOMING_MATCHES,
} from "../data/mockData";
import { useApiKey } from "../hooks/useApiKey";
import { useLiveMatches } from "../hooks/useLiveMatches";
import type { Match } from "../types";

const FILTER_TABS = ["All", "EPL", "La Liga", "Serie A", "Bundesliga", "UCL"];
const FILTER_MAP: Record<string, string> = {
  EPL: "PL",
  "La Liga": "PD",
  "Serie A": "SA",
  Bundesliga: "BL1",
  UCL: "CL",
};

function formatTimeAgo(date: Date): string {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 5) return "just now";
  if (secs < 60) return `${secs}s ago`;
  return `${Math.floor(secs / 60)}m ago`;
}

export default function HomeScreen() {
  const { dark } = useTheme();
  const { navigate } = useNav();
  const { apiKey } = useApiKey();
  const [activeFilter, setActiveFilter] = useState("All");
  const [mockLive, setMockLive] = useState<Match[]>(LIVE_MATCHES);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [timeAgo, setTimeAgo] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    matches: apiMatches,
    loading,
    error,
    lastUpdated,
  } = useLiveMatches(apiKey);

  // Mock minute ticker (only used in demo mode)
  useEffect(() => {
    if (apiKey) return;
    intervalRef.current = setInterval(() => {
      setMockLive((prev) =>
        prev.map((m) =>
          m.status === "LIVE" && m.minute !== undefined
            ? { ...m, minute: Math.min((m.minute ?? 0) + 1, 90) }
            : m,
        ),
      );
    }, 60000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [apiKey]);

  // Ticker for "last updated" display
  useEffect(() => {
    if (!lastUpdated) return;
    setTimeAgo(formatTimeAgo(lastUpdated));
    const t = setInterval(() => setTimeAgo(formatTimeAgo(lastUpdated)), 5000);
    return () => clearInterval(t);
  }, [lastUpdated]);

  const filterByLeague = (matches: Match[]) => {
    if (activeFilter === "All") return matches;
    const id = FILTER_MAP[activeFilter];
    return matches.filter((m) => m.leagueId === id);
  };

  const searchFilter = (matches: Match[]) => {
    if (!searchQuery) return matches;
    const q = searchQuery.toLowerCase();
    return matches.filter(
      (m) =>
        m.homeTeam.name.toLowerCase().includes(q) ||
        m.awayTeam.name.toLowerCase().includes(q) ||
        m.leagueName.toLowerCase().includes(q),
    );
  };

  // Real API data splits
  const liveSource = apiKey
    ? apiMatches.filter((m) => m.status === "LIVE" || m.status === "HT")
    : mockLive;
  const upcomingSource = apiKey
    ? apiMatches.filter((m) => m.status === "UPCOMING")
    : UPCOMING_MATCHES;
  const resultsSource = apiKey
    ? apiMatches.filter((m) => m.status === "FINISHED")
    : RECENT_RESULTS;

  const filteredLive = searchFilter(filterByLeague(liveSource));
  const filteredUpcoming = searchFilter(filterByLeague(upcomingSource));
  const filteredResults = searchFilter(filterByLeague(resultsSource));

  const bg = dark ? "#0f1923" : "#f0f4f8";
  const cardBg = dark ? "#1a2535" : "#ffffff";
  const inputBg = dark ? "#1a2535" : "#ffffff";

  return (
    <div
      className="flex flex-col"
      style={{ backgroundColor: bg, minHeight: "100%" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 pt-12 pb-3"
        style={{ backgroundColor: dark ? "#0a1520" : "#ffffff" }}
      >
        <div>
          <div className="text-[10px] font-medium" style={{ color: "#00e676" }}>
            SULTAN
          </div>
          <div
            className="text-lg font-bold"
            style={{ color: dark ? "#ffffff" : "#1e293b" }}
          >
            Live Scores
          </div>
        </div>
        <div className="flex items-center gap-2">
          {apiKey && lastUpdated && (
            <span
              className="text-[10px] px-2 py-1 rounded-full"
              style={{
                color: "#00e676",
                backgroundColor: dark ? "#0f2a1a" : "#f0fdf4",
              }}
            >
              ↻ {timeAgo}
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowSearch((s) => !s)}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: dark ? "#1a2535" : "#f1f5f9" }}
            data-ocid="home.button"
          >
            <span className="text-base">{showSearch ? "✕" : "🔍"}</span>
          </button>
          <button
            type="button"
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: dark ? "#1a2535" : "#f1f5f9" }}
          >
            <span className="text-base">🔔</span>
          </button>
        </div>
      </div>

      {/* Demo mode banner */}
      {!apiKey && (
        <div
          className="px-4 py-2 flex items-center gap-2"
          style={{
            backgroundColor: dark ? "#1a1a00" : "#fffbeb",
            borderBottom: "1px solid #f59e0b44",
          }}
        >
          <span className="text-xs" style={{ color: "#f59e0b" }}>
            📡 Demo mode — add API key in Settings for live scores
          </span>
        </div>
      )}

      {/* Search bar */}
      {showSearch && (
        <div
          className="px-4 py-2"
          style={{ backgroundColor: dark ? "#0a1520" : "#ffffff" }}
        >
          <input
            type="text"
            placeholder="Search teams, leagues, matches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-xl text-sm outline-none"
            style={{
              backgroundColor: inputBg,
              color: dark ? "#ffffff" : "#1e293b",
              border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
            }}
            data-ocid="home.search_input"
          />
        </div>
      )}

      {/* League filter tabs */}
      <div
        className="flex gap-2 px-4 py-3 overflow-x-auto"
        style={{ backgroundColor: dark ? "#0a1520" : "#ffffff" }}
      >
        {FILTER_TABS.map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              backgroundColor:
                activeFilter === tab ? "#00e676" : dark ? "#1a2535" : "#f1f5f9",
              color:
                activeFilter === tab ? "#0a1520" : dark ? "#94a3b8" : "#64748b",
            }}
            data-ocid="home.tab"
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 p-4">
        {/* Loading state */}
        {apiKey && loading && (
          <div className="flex flex-col gap-2" data-ocid="home.loading_state">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        )}

        {/* Error state */}
        {apiKey && error && !loading && (
          <div
            className="px-4 py-3 rounded-xl text-sm"
            style={{
              backgroundColor: dark ? "#2a0f0f" : "#fef2f2",
              color: "#ef4444",
            }}
            data-ocid="home.error_state"
          >
            ⚠️ {error}
          </div>
        )}

        {/* Live Now */}
        {(!apiKey || !loading) && filteredLive.length > 0 && (
          <div>
            <SectionHeader title="LIVE NOW" count={filteredLive.length} />
            <div className="flex flex-col gap-2">
              {filteredLive.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        )}

        {/* League Quick Nav */}
        {!searchQuery && (
          <div>
            <SectionHeader title="LEAGUES" />
            <div className="flex gap-2 overflow-x-auto py-1">
              {LEAGUES.map((league) => (
                <button
                  type="button"
                  key={league.id}
                  onClick={() => navigate({ type: "league-detail", league })}
                  className="flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl"
                  style={{ backgroundColor: cardBg, minWidth: 70 }}
                  data-ocid="home.link"
                >
                  <span className="text-xl">{league.flag}</span>
                  <span
                    className="text-[9px] font-medium text-center"
                    style={{ color: dark ? "#94a3b8" : "#64748b" }}
                  >
                    {league.shortName}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming */}
        {(!apiKey || !loading) && filteredUpcoming.length > 0 && (
          <div>
            <SectionHeader title="UPCOMING" />
            <div className="flex flex-col gap-2">
              {filteredUpcoming.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        )}

        {/* Recent Results */}
        {(!apiKey || !loading) && filteredResults.length > 0 && (
          <div>
            <SectionHeader title="RECENT RESULTS" />
            <div className="flex flex-col gap-2">
              {filteredResults.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        )}

        {(!apiKey || !loading) &&
          filteredLive.length === 0 &&
          filteredUpcoming.length === 0 &&
          filteredResults.length === 0 && (
            <div
              className="flex flex-col items-center justify-center py-16 gap-3"
              data-ocid="home.empty_state"
            >
              <span className="text-4xl">⚽</span>
              <span style={{ color: "#64748b" }}>No matches found</span>
            </div>
          )}
      </div>
    </div>
  );
}
