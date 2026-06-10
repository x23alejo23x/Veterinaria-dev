import { useState, useEffect, useRef } from "react";
import { visitChart } from "@/constants";
import { Card } from "@/components/ui/Card";

const total = visitChart.reduce((s, d) => s + d.citas, 0);
const totalAltas = visitChart.reduce((s, d) => s + d.altas, 0);
const maxVal = Math.max(...visitChart.map((d) => Math.max(d.citas, d.altas)));

export function ActivityChart() {
  const [hovered, setHovered] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const avgCitas = Math.round(total / visitChart.length);
  const avgAltas = Math.round(totalAltas / visitChart.length);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--text)]">
            Actividad semanal
          </p>
          <p className="text-xs text-[var(--text-3)] mt-0.5">
            Lun — Sáb · semana actual
          </p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-xs text-[var(--text-2)] hover:bg-[var(--surface-3)] transition-colors"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {expanded ? (
              <>
                <polyline points="4 14 10 14 10 20" />
                <polyline points="20 10 14 10 14 4" />
                <line x1="10" y1="14" x2="21" y2="3" />
                <line x1="3" y1="21" x2="14" y2="10" />
              </>
            ) : (
              <>
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </>
            )}
          </svg>
          {expanded ? "Contraer" : "Expandir"}
        </button>
      </div>

      {/* Stat pills */}
      <div className="mb-5 grid grid-cols-4 gap-3">
        {[
          {
            label: "Total citas",
            value: total,
            color: "text-violet-600",
            bg: "bg-blue-50 dark:bg-blue-950/30",
          },
          {
            label: "Total altas",
            value: totalAltas,
            color: "text-emerald-600",
            bg: "bg-emerald-50 dark:bg-emerald-950/30",
          },
          {
            label: "Prom. diario citas",
            value: avgCitas,
            color: "text-violet-600",
            bg: "bg-violet-50 dark:bg-violet-950/30",
          },
          {
            label: "Prom. diario altas",
            value: avgAltas,
            color: "text-amber-600",
            bg: "bg-amber-50 dark:bg-amber-950/30",
          },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl ${s.bg} px-3 py-2.5`}>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-[var(--text-3)] mt-0.5 leading-tight">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Chart area */}
      <div className="relative" style={{ height: expanded ? 200 : 128 }}>
        {/* Y-axis grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
          <div
            key={pct}
            className="absolute left-0 right-0 border-t border-dashed border-[var(--border)] opacity-50"
            style={{ bottom: `${pct * 100}%` }}
          />
        ))}

        {/* Bars */}
        <div className="absolute inset-0 flex items-end gap-2 pt-2">
          {visitChart.map((d, i) => {
            const hPct = d.citas / maxVal;
            const aPct = d.altas / maxVal;
            const isHov = hovered === i;

            return (
              <div
                key={d.day}
                className="relative flex flex-1 flex-col items-center justify-end gap-0"
                style={{ height: "100%" }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Tooltip */}
                {isHov && (
                  <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 shadow-lg">
                    <p className="text-[11px] font-semibold text-[var(--text)] mb-1">
                      {d.day}
                    </p>
                    <div className="flex gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-sm bg-blue-500 inline-block" />
                        <span className="text-[10px] text-[var(--text-2)]">
                          {d.citas} citas
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-sm bg-emerald-500 inline-block" />
                        <span className="text-[10px] text-[var(--text-2)]">
                          {d.altas} altas
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stacked bars container */}
                <div
                  className="relative w-full flex items-end gap-[3px]"
                  style={{ height: "100%" }}
                >
                  {/* Citas bar */}
                  <div
                    className="flex-1 rounded-t-md transition-all duration-300"
                    style={{
                      height: `${hPct * 100}%`,
                      minHeight: 4,
                      background: isHov ? "#1d4ed8" : "#3b82f6",
                    }}
                  />
                  {/* Altas bar */}
                  <div
                    className="flex-1 rounded-t-md transition-all duration-300"
                    style={{
                      height: `${aPct * 100}%`,
                      minHeight: 4,
                      background: isHov ? "#059669" : "#10b981",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Day labels */}
      <div className="mt-2 flex gap-2">
        {visitChart.map((d) => (
          <p
            key={d.day}
            className="flex-1 text-center text-[10px] text-[var(--text-3)]"
          >
            {d.day}
          </p>
        ))}
      </div>

      {/* Legend + expanded details */}
      <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-3 rounded-sm bg-blue-500 inline-block" />
            <span className="text-[10px] text-[var(--text-3)]">
              Citas atendidas
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-3 rounded-sm bg-emerald-500 inline-block" />
            <span className="text-[10px] text-[var(--text-3)]">
              Altas médicas
            </span>
          </div>
        </div>
        {expanded && (
          <p className="text-[10px] text-[var(--text-3)]">
            Tasa de alta:{" "}
            <span className="font-semibold text-emerald-600">
              {Math.round((totalAltas / total) * 100)}%
            </span>
          </p>
        )}
      </div>

      {/* Expanded: per-day table */}
      {expanded && (
        <div className="mt-4 rounded-xl border border-[var(--border)] overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[var(--surface-2)]">
                <th className="px-4 py-2.5 text-left font-semibold text-[var(--text-3)]">
                  Día
                </th>
                <th className="px-4 py-2.5 text-right font-semibold text-[var(--text-3)]">
                  Citas
                </th>
                <th className="px-4 py-2.5 text-right font-semibold text-[var(--text-3)]">
                  Altas
                </th>
                <th className="px-4 py-2.5 text-right font-semibold text-[var(--text-3)]">
                  Tasa alta
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {visitChart.map((d) => (
                <tr
                  key={d.day}
                  className="hover:bg-[var(--surface-2)] transition-colors"
                >
                  <td className="px-4 py-2.5 font-medium text-[var(--text)]">
                    {d.day}
                  </td>
                  <td className="px-4 py-2.5 text-right text-violet-600 font-semibold">
                    {d.citas}
                  </td>
                  <td className="px-4 py-2.5 text-right text-emerald-600 font-semibold">
                    {d.altas}
                  </td>
                  <td className="px-4 py-2.5 text-right text-[var(--text-2)]">
                    {Math.round((d.altas / d.citas) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
