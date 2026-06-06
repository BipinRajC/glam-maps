"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GlamDropdownProps<T> {
  label: string;
  icon: "my_location" | "location_on";
  options: T[];
  value: T | null;
  onChange: (v: T) => void;
  pinned?: T | null;
  excludeIds?: string[];
  getId: (v: T) => string;
  renderOption: (v: T) => React.ReactNode;
  getSearchText: (v: T) => string;
  placeholder?: string;
}

export default function GlamDropdown<T>({
  label,
  icon,
  options,
  value,
  onChange,
  pinned,
  excludeIds = [],
  getId,
  renderOption,
  getSearchText,
  placeholder = "Search…",
}: GlamDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonId = useRef(`glam-dropdown-${Math.random().toString(36).slice(2, 8)}`);
  const listId = `${buttonId.current}-list`;

  const filteredOptions = useMemo(
    () => options.filter((o) => !excludeIds.includes(getId(o))),
    [options, excludeIds, getId],
  );

  const visibleOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return filteredOptions;
    const scored: Array<{ item: T; score: number }> = [];
    for (const item of filteredOptions) {
      const text = getSearchText(item).toLowerCase();
      if (text.startsWith(q)) scored.push({ item, score: 3 });
      else if (text.includes(q)) scored.push({ item, score: 2 });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.map((s) => s.item);
  }, [filteredOptions, query, getSearchText]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    if (open) {
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const select = useCallback(
    (v: T) => {
      onChange(v);
      setOpen(false);
      setQuery("");
    },
    [onChange],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(visibleOptions.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = pinned && query.trim() === "" ? pinned : visibleOptions[activeIndex];
      if (item) select(item);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      setQuery("");
    }
  };

  const iconChar = icon === "my_location" ? "📍" : "📌";

  return (
    <div ref={containerRef} className="relative w-full" onKeyDown={onKeyDown}>
      <motion.button
        id={buttonId.current}
        type="button"
        className="w-full min-h-[48px] flex items-center gap-3 px-4 py-3 rounded-lg bg-white text-left"
        style={{
          border: "1px solid #DCC0C5",
          boxShadow: "0 2px 8px rgba(99,102,241,0.05)",
        }}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        whileTap={{ scale: 0.99 }}
      >
        <span className="text-lg shrink-0" style={{ color: "#831843" }}>{iconChar}</span>
        <div className="flex-1 min-w-0">
          <p
            className="font-inter text-[0.7rem] uppercase tracking-widest font-semibold leading-none mb-1"
            style={{ color: "#831843" }}
          >
            {label}
          </p>
          <p
            className="font-inter text-sm leading-tight truncate"
            style={{ color: value ? "#1e1b4b" : "#564146" }}
          >
            {value ? (typeof value === "object" ? (value as { name?: string }).name : String(value)) : "Choose…"}
          </p>
        </div>
        <motion.span
          className="text-base shrink-0"
          style={{ color: "#831843" }}
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▾
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={listId}
            role="listbox"
            className="absolute z-40 left-0 right-0 mt-2 rounded-lg bg-white overflow-hidden"
            style={{
              border: "1px solid #DCC0C5",
              boxShadow: "0 10px 40px rgba(99,102,241,0.15)",
            }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <div className="p-2 border-b" style={{ borderColor: "#DCC0C5" }}>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                placeholder={placeholder}
                className="w-full px-3 py-2 rounded-md font-inter text-sm outline-none"
                style={{ background: "rgba(99,102,241,0.06)", color: "#1e1b4b" }}
                aria-autocomplete="list"
              />
            </div>
            <div className="max-h-72 overflow-y-auto">
              {pinned && query.trim() === "" && (
                <button
                  type="button"
                  role="option"
                  aria-selected={value != null && getId(value) === getId(pinned)}
                  className="w-full text-left px-3 py-2.5 flex items-center gap-2"
                  style={{ background: "#FBCFE8" }}
                  onClick={() => select(pinned)}
                >
                  {renderOption(pinned)}
                </button>
              )}
              {visibleOptions.length === 0 && (
                <p
                  className="font-inter text-sm italic px-4 py-6 text-center"
                  style={{ color: "#564146" }}
                >
                  No glam spots match. Try a softer search.
                </p>
              )}
              {visibleOptions.map((opt, i) => {
                const selected = value != null && getId(value) === getId(opt);
                const active = i === activeIndex;
                return (
                  <button
                    key={getId(opt)}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    id={`${listId}-opt-${i}`}
                    className="w-full text-left px-3 py-2.5"
                    style={{
                      background: active ? "rgba(251,207,232,0.4)" : "transparent",
                      borderLeft: selected ? "3px solid #831843" : "3px solid transparent",
                    }}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => select(opt)}
                  >
                    {renderOption(opt)}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
