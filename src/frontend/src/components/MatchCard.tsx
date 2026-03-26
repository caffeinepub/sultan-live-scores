import { useNav } from "../App";
import { useTheme } from "../App";
import type { Match } from "../types";

function formatKickoff(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function TeamBadge({
  crest,
  color,
  name,
}: { crest: string; color: string; name: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
        style={{
          backgroundColor: `${color}22`,
          border: `2px solid ${color}44`,
        }}
      >
        {crest}
      </div>
      <span
        className="text-[11px] font-medium text-center leading-tight max-w-[64px]"
        style={{ color: "#cbd5e1" }}
      >
        {name}
      </span>
    </div>
  );
}

export default function MatchCard({
  match,
  compact = false,
}: { match: Match; compact?: boolean }) {
  const { navigate } = useNav();
  const { dark } = useTheme();

  const isLive = match.status === "LIVE";
  const isHT = match.status === "HT";
  const isFinished = match.status === "FINISHED";
  const isUpcoming = match.status === "UPCOMING";

  const cardBg = dark ? "#1a2535" : "#ffffff";
  const borderColor = isLive
    ? "#ef444430"
    : dark
      ? "rgba(255,255,255,0.06)"
      : "rgba(0,0,0,0.1)";

  return (
    <button
      type="button"
      onClick={() => navigate({ type: "match-detail", match })}
      className="w-full text-left rounded-xl p-3 transition-all active:scale-[0.98]"
      style={{
        backgroundColor: cardBg,
        border: `1px solid ${borderColor}`,
      }}
    >
      {/* League label */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px]" style={{ color: "#64748b" }}>
          {match.leagueFlag} {match.leagueName}
        </span>
        {isLive && (
          <span
            className="flex items-center gap-1 text-[10px] font-bold"
            style={{ color: "#ef4444" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-live" />
            LIVE {match.minute}'
          </span>
        )}
        {isHT && (
          <span className="text-[10px] font-bold" style={{ color: "#f59e0b" }}>
            HT
          </span>
        )}
        {isFinished && (
          <span className="text-[10px]" style={{ color: "#64748b" }}>
            FT
          </span>
        )}
        {isUpcoming && (
          <span
            className="text-[10px] font-medium"
            style={{ color: "#00e676" }}
          >
            {formatKickoff(match.kickoffTime)}
          </span>
        )}
      </div>

      {/* Score row */}
      <div className="flex items-center justify-between">
        <TeamBadge
          crest={match.homeTeam.crest}
          color={match.homeTeam.color}
          name={match.homeTeam.name}
        />

        <div className="flex flex-col items-center gap-1">
          {!isUpcoming ? (
            <div className="flex items-center gap-2">
              <span
                className="text-2xl font-bold"
                style={{ color: isLive ? "#ffffff" : "#94a3b8" }}
              >
                {match.homeScore}
              </span>
              <span className="text-base" style={{ color: "#475569" }}>
                :
              </span>
              <span
                className="text-2xl font-bold"
                style={{ color: isLive ? "#ffffff" : "#94a3b8" }}
              >
                {match.awayScore}
              </span>
            </div>
          ) : (
            <span className="text-base font-bold" style={{ color: "#64748b" }}>
              vs
            </span>
          )}
          {match.venue && (
            <span className="text-[9px]" style={{ color: "#475569" }}>
              {match.venue}
            </span>
          )}
        </div>

        <TeamBadge
          crest={match.awayTeam.crest}
          color={match.awayTeam.color}
          name={match.awayTeam.name}
        />
      </div>

      {/* Goal scorers */}
      {!compact && match.goals.length > 0 && (
        <div
          className="mt-2 pt-2"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex gap-3 flex-wrap">
            {match.goals
              .filter((g) => g.team === "home")
              .map((g) => (
                <span
                  key={`${g.scorer}-${g.minute}`}
                  className="text-[10px]"
                  style={{ color: "#94a3b8" }}
                >
                  ⚽ {g.scorer} {g.minute}'
                </span>
              ))}
          </div>
          {match.goals.some((g) => g.team === "away") && (
            <div className="flex gap-3 flex-wrap mt-0.5 justify-end">
              {match.goals
                .filter((g) => g.team === "away")
                .map((g) => (
                  <span
                    key={`${g.scorer}-${g.minute}`}
                    className="text-[10px]"
                    style={{ color: "#94a3b8" }}
                  >
                    ⚽ {g.scorer} {g.minute}'
                  </span>
                ))}
            </div>
          )}
        </div>
      )}
    </button>
  );
}
