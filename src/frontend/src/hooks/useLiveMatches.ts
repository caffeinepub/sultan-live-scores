import { useCallback, useEffect, useRef, useState } from "react";
import { fetchTodayMatches } from "../services/footballApi";
import type { Match } from "../types";

export function useLiveMatches(apiKey: string) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchMatches = useCallback(async () => {
    if (!apiKey) return;
    try {
      setError(null);
      const data = await fetchTodayMatches(apiKey);
      setMatches(data);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch matches");
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    if (!apiKey) {
      setMatches([]);
      return;
    }
    setLoading(true);
    fetchMatches();
    intervalRef.current = setInterval(fetchMatches, 30000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [apiKey, fetchMatches]);

  return { matches, loading, error, lastUpdated };
}
