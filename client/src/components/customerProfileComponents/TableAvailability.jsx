import React, { useEffect, useMemo, useState, useCallback } from "react";
import Draggable from "react-draggable";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * ---- MOCK DATA (replace with API later) ----------------------------------
 * You’ll fetch these from your backend:
 * - Tables (with id, capacity, price and saved x,y layout positions per admin)
 * - Occupied reservations for a given date+time
 */
const DEFAULT_TABLES = [
  // id, capacity, price, x, y (default layout positions)
  { id: "T-1", capacity: 2, price: 10, x: 60, y: 70 },
  { id: "T-2", capacity: 2, price: 10, x: 220, y: 80 },
  { id: "T-3", capacity: 4, price: 15, x: 380, y: 70 },
  { id: "T-4", capacity: 4, price: 15, x: 540, y: 80 },
  { id: "T-5", capacity: 6, price: 20, x: 120, y: 220 },
  { id: "T-6", capacity: 6, price: 20, x: 320, y: 220 },
  { id: "T-7", capacity: 4, price: 15, x: 520, y: 220 },
  { id: "T-8", capacity: 2, price: 10, x: 200, y: 360 },
  { id: "T-9", capacity: 4, price: 15, x: 380, y: 360 },
];

const MOCK_OCCUPIED = [
  // { tableId, date, time }
  { tableId: "T-6", date: "2025-08-27", time: "4:00 PM - 6:00 PM" },
  { tableId: "T-3", date: "2025-08-27", time: "4:00 PM - 6:00 PM" },
  { tableId: "T-9", date: "2025-08-29", time: "8:00 PM - 10:00 PM" },
];

/** localStorage keys (stand-in for backend persistence) */
const LS_LAYOUT_KEY = "platora_table_layout_v1";

/** helpers for layout persistence (replace with axios later) */
const loadLayout = () => {
  try {
    const raw = localStorage.getItem(LS_LAYOUT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const saveLayout = (tables) => {
  try {
    localStorage.setItem(LS_LAYOUT_KEY, JSON.stringify(tables));
  } catch {}
};

/** A capsule/pill style for the table node */
const TableNode = ({
  table,
  occupied,
  selected,
  selectable,
  onSelect,
  adminMode,
}) => {
  const base =
    "rounded-full px-4 py-2 text-sm font-medium shadow-sm select-none";
  const colors = occupied
    ? "bg-rose-200 text-rose-900 dark:bg-rose-900/40 dark:text-rose-200 cursor-not-allowed"
    : selected
    ? "bg-emerald-500 text-white"
    : selectable
    ? "bg-gray-900 text-white hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer"
    : "bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300 cursor-not-allowed";

  return (
    <div
      onClick={() => {
        if (!adminMode && selectable && !occupied) onSelect?.(table.id);
      }}
      className={`${base} ${colors}`}
      style={{ width: 140, textAlign: "center" }}
      title={
        occupied
          ? "Occupied"
          : `Table ${table.id} • Capacity ${table.capacity} • $${table.price}`
      }
    >
      <div className="text-xs opacity-80">Table {table.id}</div>
      <div className="text-[11px] opacity-70">
        {table.capacity} ppl · ${table.price}
      </div>
    </div>
  );
};

export default function TableAvailability() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // incoming state from ReservationPage
  const date = state?.date || "";
  const time = state?.time || "";
  const guests = Number(state?.guests || 0);

  // turn admin mode on by passing { admin: true } in navigation state
  const adminMode = Boolean(state?.admin);

  // Load layout (pretend from API). If none, use defaults.
  const [tables, setTables] = useState(() => {
    const stored = loadLayout();
    return stored || DEFAULT_TABLES;
  });

  // Which tables are occupied for this specific date/time?
  const occupiedSet = useMemo(() => {
    return new Set(
      MOCK_OCCUPIED.filter((r) => r.date === date && r.time === time).map(
        (r) => r.tableId
      )
    );
  }, [date, time]);

  // Customer selection
  const [selected, setSelected] = useState([]); // up to 2

  const toggleSelect = (tableId) => {
    setSelected((prev) => {
      if (prev.includes(tableId)) return prev.filter((id) => id !== tableId);
      if (prev.length >= 2) return prev; // max 2 tables
      return [...prev].concat(tableId);
    });
  };

  const proceed = () => {
    const chosen = tables.filter((t) => selected.includes(t.id));
    navigate("/reservation-form", {
      state: {
        date,
        time,
        guests,
        tables: chosen,
        totalFee: chosen.reduce((s, t) => s + t.price, 0),
      },
    });
  };

  // Admin drag stop → persist layout
  const onDragStop = useCallback(
    (id, e, data) => {
      setTables((prev) => {
        const next = prev.map((t) =>
          t.id === id ? { ...t, x: data.x, y: data.y } : t
        );
        saveLayout(next);
        return next;
      });
    },
    [setTables]
  );

  // Basic guard for customer flow
  useEffect(() => {
    if (!adminMode && (!date || !time || !guests)) {
      // Came directly — send back to first page
      navigate("/reservations", { replace: true });
    }
  }, [adminMode, date, time, guests, navigate]);

  return (
    <div className="min-h-screen bg-emerald-50/50 dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {adminMode ? "Arrange Tables (Admin)" : "Select a Table"}
            </h1>
            {!adminMode && (
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                <span className="font-medium">Date:</span> {date} &nbsp;•&nbsp;
                <span className="font-medium">Time:</span> {time} &nbsp;•&nbsp;
                <span className="font-medium">Guests:</span> {guests}
              </p>
            )}
            <p className="text-sm mt-1 opacity-80">
              {adminMode
                ? "Drag tables to arrange the floor layout. Positions are saved automatically."
                : "You can select up to 2 tables for this time slot."}
            </p>
          </div>

          <div className="flex gap-2">
            {!adminMode && (
              <>
                <button
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                  Back
                </button>
                <button
                  disabled={selected.length === 0}
                  onClick={proceed}
                  className={[
                    "px-4 py-2 rounded-lg font-semibold",
                    selected.length === 0
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                      : "bg-emerald-500 text-white hover:bg-emerald-600",
                  ].join(" ")}
                >
                  Continue
                </button>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            Selected
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-900 inline-block" />
            Available
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
            Occupied
          </span>
        </div>

        {/* Canvas */}
        <div
          className="mt-6 relative rounded-xl border bg-white/70 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          style={{
            height: 520,
            overflow: "hidden",
          }}
        >
          {/* Optional grid background feel */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Tables */}
          {tables.map((t) => {
            const occupied = occupiedSet.has(t.id);
            const isSelected = selected.includes(t.id);

            // In customer mode, a table is selectable only if it fits the party size
            const fitsGuests = guests ? t.capacity >= guests : true;
            const selectable = !adminMode && !occupied && fitsGuests;

            const content = (
              <div style={{ width: 140 }}>
                <TableNode
                  table={t}
                  occupied={occupied}
                  selected={isSelected}
                  selectable={selectable}
                  onSelect={toggleSelect}
                  adminMode={adminMode}
                />
              </div>
            );

            if (adminMode) {
              return (
                <Draggable
                  key={t.id}
                  defaultPosition={{ x: t.x, y: t.y }}
                  grid={[10, 10]}
                  bounds="parent"
                  onStop={(e, data) => onDragStop(t.id, e, data)}
                >
                  <div
                    className="absolute"
                    style={{ touchAction: "none", cursor: "grab" }}
                  >
                    {content}
                  </div>
                </Draggable>
              );
            }

            // Customer mode: fixed positions (not draggable)
            return (
              <div
                key={t.id}
                className="absolute"
                style={{ left: t.x, top: t.y }}
              >
                {content}
              </div>
            );
          })}
        </div>

        {/* Footer info (customer) */}
        {!adminMode && (
          <div className="mt-6 text-sm opacity-80">
            Selected ({selected.length}/2):{" "}
            {selected.length ? selected.join(", ") : "No tables selected yet."}
          </div>
        )}
      </div>
    </div>
  );
}
