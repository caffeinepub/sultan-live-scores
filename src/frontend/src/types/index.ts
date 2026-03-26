export type MatchStatus = "LIVE" | "UPCOMING" | "FINISHED" | "HT";

export interface Team {
  id: string;
  name: string;
  shortName: string;
  crest: string; // emoji or color
  color: string;
}

export interface Goal {
  scorer: string;
  minute: number;
  team: "home" | "away";
  assist?: string;
}

export interface Match {
  id: string;
  leagueId: string;
  leagueName: string;
  leagueFlag: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  minute?: number;
  kickoffTime: string; // ISO string
  goals: Goal[];
  venue?: string;
}

export interface MatchEvent {
  id: string;
  minute: number;
  type:
    | "GOAL"
    | "YELLOW_CARD"
    | "RED_CARD"
    | "SUBSTITUTION"
    | "VAR"
    | "PENALTY";
  team: "home" | "away";
  player: string;
  detail?: string;
}

export interface MatchStats {
  possession: [number, number]; // home, away
  shots: [number, number];
  shotsOnTarget: [number, number];
  fouls: [number, number];
  corners: [number, number];
  offsides: [number, number];
  yellowCards: [number, number];
  redCards: [number, number];
  passes: [number, number];
  passAccuracy: [number, number];
}

export interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
}

export interface Lineup {
  formation: string;
  starters: Player[];
  subs: Player[];
}

export interface MatchDetail extends Match {
  events: MatchEvent[];
  stats: MatchStats;
  homeLineup: Lineup;
  awayLineup: Lineup;
  commentary: string[];
}

export interface Standing {
  rank: number;
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  form: ("W" | "D" | "L")[];
}

export interface League {
  id: string;
  name: string;
  shortName: string;
  country: string;
  flag: string;
  color: string;
  season: string;
}
