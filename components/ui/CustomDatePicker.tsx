import React, { useState, useEffect } from "react";
import { Calendar, Clock, ChevronDown } from "lucide-react";

interface CustomDatePickerProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  isNull?: boolean;
  isDateTime?: boolean;
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
  const [viewDate, setViewDate] = useState(
    value ? new Date(value) : new Date(),
  );

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
    const newDate = new Date(viewDate);
    newDate.setDate(day);

    if (isDateTime) {
      const current = value ? new Date(value) : new Date();
      newDate.setHours(current.getHours(), current.getMinutes(), 0, 0);
      onChange(newDate.toISOString().slice(0, 16));
    } else {
      onChange(newDate.toISOString().slice(0, 10));
      setIsOpen(false);
    }
  };

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
  const today = new Date();
  const selectedDate = value ? new Date(value) : null;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        disabled={disabled || isNull}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/[0.02] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-white flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all disabled:opacity-30 hover:bg-white/[0.04]"
      >
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          {isDateTime ? (
            <Clock className="h-4 w-4 text-primary/50" />
          ) : (
            <Calendar className="h-4 w-4 text-primary/50" />
          )}
        </div>
        <span className={value ? "text-white" : "text-zinc-500"}>
          {value
            ? isDateTime
              ? new Date(value).toLocaleString()
              : new Date(value).toLocaleDateString()
            : `Select ${isDateTime ? "Date & Time" : "Date"}...`}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 z-[210] bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-150 min-w-[300px]">
          <div className="flex items-center justify-between mb-4 px-1">
            <span className="text-xs font-black text-white uppercase tracking-widest">
              {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setViewDate(
                    new Date(viewDate.getFullYear(), viewDate.getMonth() - 1),
                  )
                }
                className="p-1.5 hover:bg-white/5 rounded-md text-zinc-500 hover:text-white transition-all"
              >
                <ChevronDown className="h-3.5 w-3.5 rotate-90" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setViewDate(
                    new Date(viewDate.getFullYear(), viewDate.getMonth() + 1),
                  )
                }
                className="p-1.5 hover:bg-white/5 rounded-md text-zinc-500 hover:text-white transition-all"
              >
                <ChevronDown className="h-3.5 w-3.5 -rotate-90" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div
                key={d}
                className="text-[10px] font-black text-zinc-600 text-center uppercase py-1"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({
              length: firstDayOfMonth(
                viewDate.getFullYear(),
                viewDate.getMonth(),
              ),
            }).map((_, i) => (
              <div key={`empty-${i}`} className="p-2"></div>
            ))}
            {Array.from({
              length: daysInMonth(viewDate.getFullYear(), viewDate.getMonth()),
            }).map((_, i) => {
              const day = i + 1;
              const isSelected =
                (selectedDate &&
                  selectedDate.getDate() === day &&
                  selectedDate.getMonth() === viewDate.getMonth() &&
                  selectedDate.getFullYear() === viewDate.getFullYear()) ||
                false;
              const isToday =
                today.getDate() === day &&
                today.getMonth() === viewDate.getMonth() &&
                today.getFullYear() === viewDate.getFullYear();

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  className={`p-2 text-xs font-bold rounded-lg transition-all border border-transparent ${isSelected ? "bg-primary text-black border-primary" : isToday ? "text-primary bg-primary/10 border-primary/20" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {isDateTime && (
            <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  Time Precision
                </span>
                {value && (
                  <span className="text-[10px] font-bold text-primary">
                    {new Date(value).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
              <input
                type="time"
                value={
                  value ? new Date(value).toISOString().slice(11, 16) : "12:00"
                }
                onChange={(e) => {
                  const [h, m] = e.target.value.split(":");
                  const current = value ? new Date(value) : new Date();
                  const newDate = new Date(current);
                  newDate.setHours(parseInt(h), parseInt(m));
                  onChange(newDate.toISOString().slice(0, 16));
                }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all [color-scheme:dark]"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
