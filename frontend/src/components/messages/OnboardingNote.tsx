import { useCallback, useEffect, useState } from "react";
import { HTTP_BACKEND_URL } from "../../config";

type DailyAttemptStats = {
  used: number;
  limit: number;
  remaining: number;
};

const FALLBACK_STATS: DailyAttemptStats = {
  used: 0,
  limit: 10,
  remaining: 10,
};

export function OnboardingNote() {
  const [stats, setStats] = useState<DailyAttemptStats>(FALLBACK_STATS);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${HTTP_BACKEND_URL}/api/usage/daily-attempts`);
      if (!response.ok) return;
      const data = (await response.json()) as Partial<DailyAttemptStats>;
      if (
        typeof data.used !== "number" ||
        typeof data.limit !== "number" ||
        typeof data.remaining !== "number"
      ) {
        return;
      }
      setStats(data as DailyAttemptStats);
    } catch {
      // Keep fallback text when backend is unavailable.
    }
  }, []);

  useEffect(() => {
    fetchStats();

    const interval = window.setInterval(fetchStats, 15000);
    const onAttempt = () => {
      fetchStats();
    };

    window.addEventListener("generation-attempted", onAttempt);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("generation-attempted", onAttempt);
    };
  }, [fetchStats]);

  return (
    <div className="flex flex-col space-y-4 bg-green-700 p-2 rounded text-stone-200 text-sm">
      <span>
        Only {stats.limit} total attempts are available per day globally
        (shared by everyone).
      </span>
      <span>
        Used today: {stats.used} / {stats.limit} ({stats.remaining} remaining)
      </span>
    </div>
  );
}
