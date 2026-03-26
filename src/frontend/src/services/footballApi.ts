import type { Match, Standing, Team } from "../types";

const BASE_URL = "https://api.football-data.org/v4";

const LEAGUE_FLAGS: Record<string, string> = {
  PL: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  PD: "🇪🇸",
  SA: "🇮🇹",
  BL1: "🇩🇪",
  CL: "🏆",
  FL1: "🇫🇷",
};

const TEAM_COLORS: Record<string, string> = {
  default: "#64748b",
};

function mapStatus(status: string): Match["status"] {
  switch (status) {
    case "IN_PLAY":
      return "LIVE";
    case "PAUSED":
      return "HT";
    case "FINISHED":
      return "FINISHED";
    default:
      return "UPCOMING";
  }
}

function mapTeam(t: {
  id: number;
  name: string;
  shortName?: string;
  tla?: string;
  crest?: string;
}): Team {
  return {
    id: String(t.id),
    name: t.name,
    shortName: t.shortName || t.tla || t.name.slice(0, 3).toUpperCase(),
    crest: t.crest || "⚽",
    color: TEAM_COLORS.default,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapMatch(m: any): Match {
  const leagueId: string = m.competition?.code || "";
  return {
    id: String(m.id),
    leagueId,
    leagueName: m.competition?.name || "",
    leagueFlag: LEAGUE_FLAGS[leagueId] || "🏆",
    homeTeam: mapTeam(m.homeTeam),
    awayTeam: mapTeam(m.awayTeam),
    homeScore: m.score?.fullTime?.home ?? m.score?.halfTime?.home ?? 0,
    awayScore: m.score?.fullTime?.away ?? m.score?.halfTime?.away ?? 0,
    status: mapStatus(m.status),
    minute: m.minute ?? undefined,
    kickoffTime: m.utcDate,
    goals: [],
    venue: m.venue ?? undefined,
  };
}

async function apiFetch(apiKey: string, path: string): Promise<any> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "X-Auth-Token": apiKey },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

export async function fetchTodayMatches(apiKey: string): Promise<Match[]> {
  const data = await apiFetch(apiKey, "/matches");
  return (data.matches || []).map(mapMatch);
}

export async function fetchStandings(
  apiKey: string,
  leagueId: string,
): Promise<Standing[]> {
  const data = await apiFetch(apiKey, `/competitions/${leagueId}/standings`);
  const table = data.standings?.[0]?.table || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return table.map(
    (row: any): Standing => ({
      rank: row.position,
      team: mapTeam(row.team),
      played: row.playedGames,
      won: row.won,
      drawn: row.draw,
      lost: row.lost,
      goalsFor: row.goalsFor,
      goalsAgainst: row.goalsAgainst,
      goalDiff: row.goalDifference,
      points: row.points,
      form: row.form
        ? (row.form as string)
            .split(",")
            .map((f: string) => f.trim() as "W" | "D" | "L")
            .filter(Boolean)
        : [],
    }),
  );
}

export async function fetchLeagueMatches(
  apiKey: string,
  leagueId: string,
): Promise<Match[]> {
  const today = new Date();
  const from = new Date(today);
  from.setDate(from.getDate() - 7);
  const to = new Date(today);
  to.setDate(to.getDate() + 7);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const data = await apiFetch(
    apiKey,
    `/competitions/${leagueId}/matches?dateFrom=${fmt(from)}&dateTo=${fmt(to)}`,
  );
  return (data.matches || []).map(mapMatch);
}
