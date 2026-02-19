import { useEffect, useState } from "react";
import { HTTP_BACKEND_URL } from "../../config";
import { Button } from "../ui/button";
import { FaChevronLeft, FaChevronRight, FaSave, FaTrash } from "react-icons/fa";

interface HistoryEntry {
  id: string;
  theme_name: string;
  generated_at: string;
  saved: boolean;
  code: string;
}

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function ThemeHistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [previewEntry, setPreviewEntry] = useState<HistoryEntry | null>(null);

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const fetchHistory = () => {
    fetch(`${HTTP_BACKEND_URL}/api/themes/history`)
      .then((r) => r.json())
      .then((data) => setEntries(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchHistory(); }, []);

  // Auto-select today if it has entries
  useEffect(() => {
    if (entries.length === 0) return;
    const today = now.toISOString().slice(0, 10);
    const hasToday = entries.some((e) => e.generated_at.slice(0, 10) === today);
    if (hasToday) setSelectedDate(today);
  }, [entries]);

  const deleteEntry = async (id: string) => {
    const password = window.prompt("Admin password to delete:");
    if (!password) return;
    const res = await fetch(`${HTTP_BACKEND_URL}/api/themes/history/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Basic " + btoa(`admin:${password}`) },
    });
    if (res.ok) {
      setEntries((prev) => prev.filter((e) => e.id !== id));
      if (previewEntry?.id === id) setPreviewEntry(null);
    } else {
      alert("Invalid password");
    }
  };

  // Group by date
  const byDate: Record<string, HistoryEntry[]> = {};
  for (const e of entries) {
    const d = e.generated_at.slice(0, 10);
    if (!byDate[d]) byDate[d] = [];
    byDate[d].push(e);
  }

  const selectedEntries = selectedDate ? (byDate[selectedDate] ?? []) : [];

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const today = now.toISOString().slice(0, 10);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
        Loading history...
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 mt-4">
      <div className="px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
          Generation History
        </h2>
        <p className="text-xs text-gray-400">
          Every generated site is logged here. Saved entries are marked with a star.
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="px-4 pb-4 text-sm text-gray-400">
          No history yet. Generate a site to start tracking.
        </div>
      ) : (
        <div className="flex gap-0 min-h-[480px]">
          {/* Calendar column */}
          <div className="w-56 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 px-3 py-3">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-3">
              <button onClick={prevMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                <FaChevronLeft size={10} className="text-gray-500" />
              </button>
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
              <button onClick={nextMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                <FaChevronRight size={10} className="text-gray-500" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {["S","M","T","W","T","F","S"].map((d, i) => (
                <div key={i} className="text-center text-[10px] text-gray-400 font-medium py-0.5">
                  {d}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-px">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                const dayEntries = byDate[dateStr] ?? [];
                const hasSaved = dayEntries.some((e) => e.saved);
                const hasAny = dayEntries.length > 0;
                const isSelected = selectedDate === dateStr;
                const isToday = dateStr === today;

                return (
                  <button
                    key={day}
                    onClick={() => {
                      setSelectedDate(isSelected ? null : dateStr);
                      setPreviewEntry(null);
                    }}
                    className={`
                      relative text-center text-[11px] py-1 rounded transition-colors leading-none
                      ${isSelected
                        ? "bg-blue-600 text-white font-semibold"
                        : isToday
                        ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold"
                        : hasAny
                        ? "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium"
                        : "text-gray-400 dark:text-gray-600"
                      }
                    `}
                  >
                    {day}
                    {hasAny && (
                      <span className={`
                        absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full
                        ${isSelected ? "bg-white" : hasSaved ? "bg-green-500" : "bg-blue-400"}
                      `} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-col gap-1">
              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                Saved to portfolio
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                Generated only
              </div>
            </div>

            {/* Month summary */}
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-[10px] text-gray-400 font-medium mb-1">This month</p>
              {(() => {
                const monthPrefix = `${viewYear}-${String(viewMonth + 1).padStart(2,"0")}`;
                const monthEntries = entries.filter((e) => e.generated_at.startsWith(monthPrefix));
                const savedCount = monthEntries.filter((e) => e.saved).length;
                return (
                  <div className="flex flex-col gap-0.5 text-[10px] text-gray-500">
                    <span>{monthEntries.length} generated</span>
                    <span>{savedCount} saved</span>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Day entries list */}
          {selectedDate && (
            <div className="w-52 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
              {selectedEntries.length === 0 ? (
                <p className="text-xs text-gray-400 p-3">Nothing on {selectedDate}</p>
              ) : (
                <div className="p-2 flex flex-col gap-2">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 px-1">
                    {selectedDate} · {selectedEntries.length} site{selectedEntries.length > 1 ? "s" : ""}
                  </p>
                  {selectedEntries.map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => setPreviewEntry(entry)}
                      className={`
                        text-left p-2 rounded-lg border transition-colors w-full
                        ${previewEntry?.id === entry.id
                          ? "border-blue-400 bg-blue-50 dark:bg-blue-950/40"
                          : "border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }
                      `}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            {entry.saved && (
                              <FaSave size={9} className="text-green-500 flex-shrink-0" />
                            )}
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                              {entry.theme_name || "untitled"}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {new Date(entry.generated_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteEntry(entry.id); }}
                          className="text-gray-300 hover:text-red-400 transition-colors mt-0.5 flex-shrink-0"
                        >
                          <FaTrash size={9} />
                        </button>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Preview pane */}
          <div className="flex-1 min-w-0 bg-gray-50 dark:bg-gray-900 flex flex-col">
            {previewEntry ? (
              <>
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {previewEntry.theme_name || "untitled"}
                    </span>
                    {previewEntry.saved && (
                      <span className="ml-2 text-xs text-green-600 dark:text-green-400 font-medium">
                        ★ saved
                      </span>
                    )}
                    <span className="ml-2 text-xs text-gray-400">
                      {new Date(previewEntry.generated_at).toLocaleString()}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setPreviewEntry(null)}
                    className="text-gray-400 hover:text-gray-600 text-xs"
                  >
                    ✕
                  </Button>
                </div>
                <iframe
                  srcDoc={previewEntry.code}
                  title="Theme preview"
                  className="flex-1 w-full border-0"
                  sandbox="allow-scripts"
                />
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <div className="text-3xl mb-2">🗓</div>
                  <p className="text-sm">
                    {selectedDate
                      ? "Select a site from the list to preview it"
                      : "Select a date to see generated sites"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
