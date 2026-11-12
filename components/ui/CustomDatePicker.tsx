import React, { useState, useEffect } from "react";
import { Calendar, Clock, ChevronDown } from "lucide-react";

interface CustomDatePickerProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  isNull?: boolean;
  isDateTime?: boolean;
}

/**
 * Values are database strings ("2026-11-02", "2026-11-02 08:30:00",
 * "2026-11-02 08:30:00+01"). They are split into parts and rebuilt as text,
 * never converted through a JS Date, so nothing shifts by the browser's
 * timezone.
 */
const VALUE_RE =
  /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(\.\d+)?)?)?\s*(Z|[+-]\d{2}(?::?\d{2})?)?$/i;

interface Parts {
  y: number;
  m: number; // 1-12
  d: number;
  time: string; // HH:MM:SS[.fff]
  zone: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

function parseValue(value: string): Parts | null {
  const m = VALUE_RE.exec(value.trim());
  if (!m) return null;
  const time = m[4]
    ? `${m[4]}:${m[5]}:${m[6] ?? "00"}${m[7] ?? ""}`
    : "00:00:00";
  return { y: +m[1], m: +m[2], d: +m[3], time, zone: m[8] ?? "" };
}

function formatValue(p: Parts, isDateTime?: boolean) {
  const date = `${p.y}-${pad(p.m)}-${pad(p.d)}`;
  return isDateTime ? `${date} ${p.time}${p.zone}` : date;
}

function todayParts(): Parts {
  const now = new Date();
  return {
    y: now.getFullYear(),
    m: now.getMonth() + 1,
    d: now.getDate(),
    time: "00:00:00",
    zone: "",
  };
}

const CustomDatePicker = ({
  value,
  onChange,
  disabled,
  isNull,
  isDateTime,
}: CustomDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const selected = value ? parseValue(value) : null;
  const [view, setView] = useState(() => {
    const p = selected ?? todayParts();
    return { year: p.y, month: p.m - 1 };
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const daysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const handleDayClick = (day: number) => {
    const base = selected ?? todayParts();
    onChange(
      formatValue(
        { ...base, y: view.year, m: view.month + 1, d: day },
        isDateTime,
      ),
    );
    if (!isDateTime) setIsOpen(false);
  };

  const handleTimeChange = (hhmm: string) => {
    if (!hhmm) return;
    const base = selected ?? todayParts();
    const seconds = base.time.slice(5) || ":00";
    onChange(formatValue({ ...base, time: `${hhmm}${seconds}` }, isDateTime));
  };

  const shiftMonth = (delta: number) =>
    setView(({ year, month }) => {
      const next = new Date(year, month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const today = todayParts();
  const label = selected
    ? formatValue(selected, isDateTime)
    : value || `Select ${isDateTime ? "Date & Time" : "Date"}...`;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        disabled={disabled || isNull}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-background border border-line-strong rounded-md pl-11 pr-4 py-2 text-sm text-foreground flex items-center gap-3 outline-none focus:border-primary/60 transition-all disabled:opacity-30 hover:bg-ink/[0.04]"
      >
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          {isDateTime ? (
            <Clock className="h-4 w-4 text-accent-fg/50" />
          ) : (
            <Calendar className="h-4 w-4 text-accent-fg/50" />
          )}
        </div>
        <span className={value ? "text-foreground font-mono" : "text-subtle"}>
          {label}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 z-[210] bg-card border border-border rounded-xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-150 min-w-[300px]">
          <div className="flex items-center justify-between mb-4 px-1">
            <span className="text-xs font-medium text-foreground">
              {monthNames[view.month]} {view.year}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                className="p-1.5 hover:bg-ink/5 rounded-md text-subtle hover:text-foreground transition-all"
              >
                <ChevronDown className="h-3.5 w-3.5 rotate-90" />
              </button>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                className="p-1.5 hover:bg-ink/5 rounded-md text-subtle hover:text-foreground transition-all"
              >
                <ChevronDown className="h-3.5 w-3.5 -rotate-90" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div
                key={d}
                className="text-[11px] font-medium text-subtle text-center py-1"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({
              length: firstDayOfMonth(view.year, view.month),
            }).map((_, i) => (
              <div key={`empty-${i}`} className="p-2"></div>
            ))}
            {Array.from({
              length: daysInMonth(view.year, view.month),
            }).map((_, i) => {
              const day = i + 1;
              const isSelected =
                !!selected &&
                selected.d === day &&
                selected.m === view.month + 1 &&
                selected.y === view.year;
              const isToday =
                today.d === day &&
                today.m === view.month + 1 &&
                today.y === view.year;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  className={`p-2 text-xs font-medium rounded-lg transition-all border border-transparent ${isSelected ? "bg-primary text-white border-primary" : isToday ? "text-accent-fg bg-primary/10 border-primary/20" : "text-muted-foreground hover:bg-ink/5 hover:text-foreground"}`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {isDateTime && (
            <div className="mt-4 pt-4 border-t border-border flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-subtle flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  Time Precision
                </span>
                {selected && (
                  <span className="text-[11px] font-medium text-accent-fg font-mono">
                    {selected.time}
                    {selected.zone}
                  </span>
                )}
              </div>
              <input
                type="time"
                value={selected ? selected.time.slice(0, 5) : ""}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="w-full bg-background border border-line-strong rounded-md px-4 py-2 text-xs text-foreground outline-none transition-all [color-scheme:dark] focus:border-primary/60"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
