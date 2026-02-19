import { useEffect, useState } from "react";
import { HTTP_BACKEND_URL } from "../../config";
import { Button } from "../ui/button";
import { FaChevronLeft, FaChevronRight, FaTrash } from "react-icons/fa";

interface HistoryEntry {
  id: string;
  theme_name: string;
  applied_at: string;
  preview_snippet: string;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export default function ThemeHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null); // "YYYY-MM-DD"
  const [tooltip, setTooltip] = useState<HistoryEntry | null>(null);

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  useEffect(() => {
    fetch(`${HTTP_BACKEND_URL}/api/themes/history`)
      .then((r) => r.json())
      .then(setEntries)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const deleteEntry = async (id: string) => {
    const password = window.prompt("Admin password:");
    if (!password) return;
    try {
      const res = await fetch(`${HTTP_BACKEND_URL}/api/themes/history/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Basic " + btoa(`admin:${password}`) },
      });
      if (!res.ok) throw new Error("Invalid password");
      setEntries((prev) => prev.filter((e) => e.id !== id));
      if (tooltip?.id === id) setTooltip(null);
    } catch (e) {
      alert((e as Error).message);
    }
  };

  // Group entries by date "YYYY-MM-DD"
  const byDate: Record<string, HistoryEntry[]> = {};
  for (const entry of entries) {
    const d = entry.applied_at.slice(0, 10);
    if (!byDate[d]) byDate[d] = [];
    byDate[d].push(entry);
  }

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const selectedEntries = selected ? (byDate[selected] ?? []) : [];

  if (loading) {
    return <p className="text-xs text-gray-400 mt-4">Loading history...</p>;
  }

  if (entries.length === 0) {
    return (
      <p className="text-xs text-gray-400 mt-4 text-center">
        No saved themes yet. Generate a site and click "Save to Portfolio".
      </p>
    );
  }

  return (
    <div className="mt-4 select-none">
      <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
        Theme History
      </h3>

      {/* Calendar header */}
      <div className="flex items-center justify-between mb-2">
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={prevMonth}>
          <FaChevronLeft size={10} />
        </Button>
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={nextMonth}>
          <FaChevronRight size={10} />
        </Button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
          <div key={d} className="text-center text-[10px] text-gray-400 font-medium py-0.5">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {/* Empty cells for first week */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
          const dayEntries = byDate[dateStr] ?? [];
          const hasEntries = dayEntries.length > 0;
          const isSelected = selected === dateStr;
          const isToday = dateStr === now.toISOString().slice(0, 10);

          return (
            <button
              key={day}
              onClick={() => {
                setSelected(isSelected ? null : dateStr);
                setTooltip(null);
              }}
              className={`
                relative text-center text-[11px] py-1 rounded transition-colors
                ${isSelected
                  ? "bg-blue-600 text-white font-semibold"
                  : isToday
                  ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                }
              `}
            >
              {day}
              {hasEntries && (
                <span
                  className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                    isSelected ? "bg-white" : "bg-blue-500"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day entries */}
      {selected && selectedEntries.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
            {selectedEntries.length} theme{selectedEntries.length > 1 ? "s" : ""} on {selected}
          </p>
          {selectedEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-md p-2 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between gap-1">
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate text-gray-800 dark:text-gray-200">
                    {entry.theme_name || "untitled"}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(entry.applied_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 line-clamp-2 font-mono">
                    {entry.preview_snippet.slice(0, 80)}…
                  </p>
                </div>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"
                  title="Delete entry"
                >
                  <FaTrash size={10} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && selectedEntries.length === 0 && (
        <p className="text-[11px] text-gray-400 mt-2 text-center">
          No themes saved on {selected}
        </p>
      )}
    </div>
  );
}
