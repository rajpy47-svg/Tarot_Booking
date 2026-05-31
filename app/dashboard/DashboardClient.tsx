"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Booking {
  id: number;
  booking_id: string;
  full_name: string;
  date_of_birth: string;
  partner_name: string | null;
  phone: string;
  problem_description: string;
  payment_amount: number;
  created_at: string;
}

/* ── Problem cell: 20-word preview + read more ── */
function ProblemCell({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const words = text.trim().split(/\s+/);
  const isLong = words.length > 20;
  const display = !isLong || expanded ? text : words.slice(0, 20).join(" ") + "…";

  return (
    <div style={{ width: 200 }}>
      <span className="text-white/60 text-xs leading-relaxed break-words whitespace-normal">
        {display}
      </span>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-1 text-purple-400 text-xs font-medium hover:text-purple-300 transition-colors"
        >
          {expanded ? "less" : "read more"}
        </button>
      )}
    </div>
  );
}

/* ── Edit modal ── */
function EditModal({
  booking,
  onClose,
  onSaved,
}: {
  booking: Booking;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    full_name: booking.full_name,
    date_of_birth: booking.date_of_birth,
    partner_name: booking.partner_name ?? "",
    phone: booking.phone,
    problem_description: booking.problem_description,
    payment_amount: String(booking.payment_amount),
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const save = async () => {
    setSaving(true);
    setErr("");
    const { error } = await supabase
      .from("bookings")
      .update({
        full_name: form.full_name,
        date_of_birth: form.date_of_birth,
        partner_name: form.partner_name || null,
        phone: form.phone,
        problem_description: form.problem_description,
        payment_amount: Number(form.payment_amount),
      })
      .eq("id", booking.id);
    setSaving(false);
    if (error) { setErr(error.message); return; }
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl p-6 space-y-4"
        style={{ background: "#1a1535", border: "1px solid rgba(139,51,255,0.3)" }}>

        <div className="flex items-center justify-between mb-1">
          <h2 className="text-white font-semibold text-base">
            Edit Booking <span className="text-purple-400 font-mono text-sm">#{booking.booking_id}</span>
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl leading-none">×</button>
        </div>

        {[
          { label: "Full Name", name: "full_name", type: "text" },
          { label: "Date of Birth", name: "date_of_birth", type: "date" },
          { label: "Partner Name", name: "partner_name", type: "text" },
          { label: "Phone", name: "phone", type: "tel" },
          { label: "Payment Amount", name: "payment_amount", type: "number" },
        ].map((f) => (
          <div key={f.name}>
            <label className="text-xs text-purple-300 mb-1 block">{f.label}</label>
            <input
              name={f.name}
              type={f.type}
              value={form[f.name as keyof typeof form]}
              onChange={handle}
              className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
            />
          </div>
        ))}

        <div>
          <label className="text-xs text-purple-300 mb-1 block">Problem Description</label>
          <textarea
            name="problem_description"
            rows={4}
            value={form.problem_description}
            onChange={handle}
            className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none resize-none"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
          />
        </div>

        {err && <p className="text-red-400 text-xs">{err}</p>}

        <div className="flex gap-3 pt-1">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm text-white/60 hover:text-white transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
            Cancel
          </button>
          <button onClick={save} disabled={saving}
            className="flex-1 py-2.5 rounded-xl text-sm text-white font-semibold transition-all"
            style={{ background: "linear-gradient(135deg,#8b33ff,#5c16c5)" }}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export default function DashboardClient({
  bookings: initial,
  error,
}: {
  bookings: Booking[];
  error?: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Booking | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim();
    if (!q) return initial;
    return initial.filter((b) => b.phone.includes(q));
  }, [initial, search]);

  const totalAmount = useMemo(
    () => initial.reduce((s, b) => s + Number(b.payment_amount), 0),
    [initial]
  );

  const monthSummary = useMemo(() => {
    const map: Record<string, { count: number; amount: number }> = {};
    initial.forEach((b) => {
      const key = new Date(b.created_at).toLocaleDateString("en-IN", {
        month: "long", year: "numeric",
      });
      if (!map[key]) map[key] = { count: 0, amount: 0 };
      map[key].count++;
      map[key].amount += Number(b.payment_amount);
    });
    return Object.entries(map);
  }, [initial]);

  return (
    <main className="min-h-screen p-4 sm:p-6"
      style={{ background: "linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)" }}>

      {editing && (
        <EditModal
          booking={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); router.refresh(); }}
        />
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Bookings Dashboard</h1>
            <p className="text-purple-300 text-sm mt-0.5">{initial.length} total entries</p>
          </div>
          <span className="text-2xl">🔮</span>
        </div>

        {error && (
          <div className="rounded-xl p-4 text-red-300 text-sm"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatCard label="Total Bookings" value={String(initial.length)} />
          <StatCard label="Total Earnings" value={fmt(totalAmount)} highlight />
          <StatCard label="This Month" value={fmt(monthSummary[0]?.[1]?.amount ?? 0)} className="col-span-2 sm:col-span-1" />
        </div>

        {/* Month breakdown */}
        {monthSummary.length > 0 && (
          <div className="rounded-2xl p-4 sm:p-5"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h2 className="text-purple-300 text-xs uppercase tracking-widest font-medium mb-4">
              Month-wise Breakdown
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {monthSummary.map(([month, { count, amount }]) => (
                <div key={month} className="flex justify-between items-center rounded-xl px-4 py-3"
                  style={{ background: "rgba(139,51,255,0.1)", border: "1px solid rgba(139,51,255,0.2)" }}>
                  <div>
                    <p className="text-white text-sm font-medium">{month}</p>
                    <p className="text-white/40 text-xs">{count} booking{count !== 1 ? "s" : ""}</p>
                  </div>
                  <p className="text-green-400 font-bold text-sm">{fmt(amount)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400"
            fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input type="tel" placeholder="Search by phone number..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-10 py-3 rounded-xl text-sm text-white placeholder:text-white/30 outline-none"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          />
          {search && (
            <button onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xl leading-none">×</button>
          )}
        </div>
        {search && (
          <p className="text-purple-300 text-sm -mt-2">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &quot;{search}&quot;
          </p>
        )}

        {filtered.length === 0 && !error && (
          <div className="text-center py-16 text-white/40">
            <p className="text-3xl mb-2">✦</p>
            <p>{search ? "No matching phone number found" : "No bookings yet"}</p>
          </div>
        )}

        {/* Table */}
        {filtered.length > 0 && (
          <div className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "rgba(139,51,255,0.15)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    {["", "ID", "Name", "Phone", "Partner", "DOB", "Amount", "Problem", "Date"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-purple-300 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b, i) => (
                    <tr key={b.id}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
                      }}>
                      {/* Edit button */}
                      <td className="pl-3 pr-1 py-3">
                        <button
                          onClick={() => setEditing(b)}
                          title="Edit booking"
                          className="p-1.5 rounded-lg text-white/30 hover:text-purple-400 hover:bg-purple-400/10 transition-all"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </td>
                      <td className="px-4 py-3 font-mono text-purple-400 font-bold whitespace-nowrap">{b.booking_id}</td>
                      <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{b.full_name}</td>
                      <td className="px-4 py-3 text-white/70 whitespace-nowrap">{b.phone}</td>
                      <td className="px-4 py-3 text-white/60 whitespace-nowrap">
                        {b.partner_name || <span className="text-white/25">—</span>}
                      </td>
                      <td className="px-4 py-3 text-white/60 whitespace-nowrap">{b.date_of_birth}</td>
                      <td className="px-4 py-3 text-green-400 font-semibold whitespace-nowrap">{fmt(Number(b.payment_amount))}</td>
                      <td className="px-4 py-3"><ProblemCell text={b.problem_description} /></td>
                      <td className="px-4 py-3 text-white/40 whitespace-nowrap text-xs">
                        {new Date(b.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit", month: "short", year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: "rgba(139,51,255,0.1)", borderTop: "1px solid rgba(139,51,255,0.3)" }}>
                    <td colSpan={6} className="px-4 py-3 text-purple-300 font-semibold text-sm">
                      {search ? `Filtered total (${filtered.length})` : `Grand Total (${initial.length})`}
                    </td>
                    <td className="px-4 py-3 text-green-400 font-bold text-sm whitespace-nowrap">
                      {fmt(filtered.reduce((s, b) => s + Number(b.payment_amount), 0))}
                    </td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function StatCard({ label, value, highlight, className }: {
  label: string; value: string; highlight?: boolean; className?: string;
}) {
  return (
    <div className={`rounded-xl px-4 py-4 ${className ?? ""}`}
      style={{
        background: highlight ? "rgba(139,51,255,0.2)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${highlight ? "rgba(139,51,255,0.4)" : "rgba(255,255,255,0.08)"}`,
      }}>
      <p className="text-white/50 text-xs mb-1">{label}</p>
      <p className={`font-bold text-lg ${highlight ? "text-green-400" : "text-white"}`}>{value}</p>
    </div>
  );
}
