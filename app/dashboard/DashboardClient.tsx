"use client";

import { useState, useMemo, useEffect } from "react";
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

interface Reading {
  id: number;
  booking_id: string;
  message: string;
  image_url: string | null;
  day: number;
  created_at: string;
}

/* ── Problem cell ── */
function ProblemCell({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const words = text.trim().split(/\s+/);
  const isLong = words.length > 20;
  const display = !isLong || expanded ? text : words.slice(0, 20).join(" ") + "…";
  return (
    <div style={{ width: 200 }}>
      <span className="text-white/60 text-xs leading-relaxed break-words whitespace-normal">{display}</span>
      {isLong && (
        <button onClick={() => setExpanded(!expanded)}
          className="ml-1 text-purple-400 text-xs font-medium hover:text-purple-300 transition-colors">
          {expanded ? "less" : "read more"}
        </button>
      )}
    </div>
  );
}

/* ── Edit modal ── */
function EditModal({ booking, onClose, onSaved }: { booking: Booking; onClose: () => void; onSaved: () => void }) {
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
    setSaving(true); setErr("");
    const { error } = await supabase.from("bookings").update({
      full_name: form.full_name,
      date_of_birth: form.date_of_birth,
      partner_name: form.partner_name || null,
      phone: form.phone,
      problem_description: form.problem_description,
      payment_amount: Number(form.payment_amount),
    }).eq("id", booking.id);
    setSaving(false);
    if (error) { setErr(error.message); return; }
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-2xl p-6 space-y-4"
        style={{ background: "#1a1535", border: "1px solid rgba(139,51,255,0.3)" }}>
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold">Edit <span className="text-purple-400 font-mono text-sm">#{booking.booking_id}</span></h2>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl">×</button>
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
            <input name={f.name} type={f.type} value={form[f.name as keyof typeof form]} onChange={handle}
              className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }} />
          </div>
        ))}
        <div>
          <label className="text-xs text-purple-300 mb-1 block">Problem Description</label>
          <textarea name="problem_description" rows={3} value={form.problem_description} onChange={handle}
            className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none resize-none"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }} />
        </div>
        {err && <p className="text-red-400 text-xs">{err}</p>}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm text-white/60 hover:text-white"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}>Cancel</button>
          <button onClick={save} disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm text-white font-semibold"
            style={{ background: "linear-gradient(135deg,#8b33ff,#5c16c5)" }}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Send Reading modal ── */
function ReadingModal({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const fetchReadings = async () => {
    const { data } = await supabase.from("readings").select("*")
      .eq("booking_id", booking.booking_id).order("day");
    if (data) setReadings(data);
  };

  useEffect(() => { fetchReadings(); }, [booking.booking_id]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setImage(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const send = async () => {
    if (!message.trim()) { setErr("Please write a reading message"); return; }
    setSaving(true); setErr("");
    const nextDay = readings.length + 1;
    let imageUrl: string | null = null;

    if (image) {
      const fileName = `${booking.booking_id}-day${nextDay}-${Date.now()}`;
      const { error: upErr } = await supabase.storage.from("reading-images").upload(fileName, image);
      if (upErr) { setErr(upErr.message); setSaving(false); return; }
      const { data: urlData } = supabase.storage.from("reading-images").getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
    }

    const { error } = await supabase.from("readings").insert({
      booking_id: booking.booking_id,
      message: message.trim(),
      image_url: imageUrl,
      day: nextDay,
    });

    if (error) { setErr(error.message); setSaving(false); return; }
    setMessage(""); setImage(null); setPreview(null);
    await fetchReadings();
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg rounded-2xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
        style={{ background: "#1a1535", border: "1px solid rgba(139,51,255,0.3)" }}>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold">Send Reading</h2>
            <p className="text-purple-400 text-xs mt-0.5">{booking.full_name} — #{booking.booking_id}</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl">×</button>
        </div>

        {/* Past readings */}
        {readings.length > 0 && (
          <div className="space-y-2">
            <p className="text-purple-300 text-xs uppercase tracking-widest">Sent Readings</p>
            {readings.map((r) => (
              <div key={r.id} className="rounded-xl p-3 flex gap-3"
                style={{ background: "rgba(139,51,255,0.1)", border: "1px solid rgba(139,51,255,0.2)" }}>
                <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-purple-300"
                  style={{ background: "rgba(139,51,255,0.3)" }}>
                  {r.day}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/70 text-xs leading-relaxed">{r.message}</p>
                  {r.image_url && (
                    <img src={r.image_url} alt={`Day ${r.day}`}
                      className="mt-2 rounded-lg max-h-32 object-cover" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New reading */}
        <div className="space-y-3">
          <p className="text-purple-300 text-xs uppercase tracking-widest">
            Add Day {readings.length + 1} Reading
          </p>
          <textarea
            rows={4} placeholder="Write the reading message..."
            value={message} onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none resize-none placeholder:text-white/30"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
          />

          {/* Image upload */}
          <div>
            <label className="text-xs text-purple-300 mb-1.5 block">Attach Image (optional)</label>
            <label className="flex items-center gap-2 cursor-pointer w-fit">
              <div className="px-3 py-2 rounded-lg text-xs text-white/60 hover:text-white transition-colors flex items-center gap-2"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {image ? image.name : "Choose image"}
              </div>
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
            {preview && (
              <img src={preview} alt="preview" className="mt-2 rounded-lg max-h-40 object-cover" />
            )}
          </div>
        </div>

        {err && <p className="text-red-400 text-xs">{err}</p>}

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm text-white/60 hover:text-white"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}>Close</button>
          <button onClick={send} disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm text-white font-semibold"
            style={{ background: "linear-gradient(135deg,#8b33ff,#5c16c5)" }}>
            {saving ? "Sending…" : `Send Day ${readings.length + 1}`}
          </button>
        </div>
      </div>
    </div>
  );
}

function fmt(n: number) { return "₹" + n.toLocaleString("en-IN"); }

export default function DashboardClient({ bookings: initial, error }: { bookings: Booking[]; error?: string }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Booking | null>(null);
  const [reading, setReading] = useState<Booking | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim();
    if (!q) return initial;
    return initial.filter((b) => b.phone.includes(q));
  }, [initial, search]);

  const totalAmount = useMemo(() => initial.reduce((s, b) => s + Number(b.payment_amount), 0), [initial]);

  const monthSummary = useMemo(() => {
    const map: Record<string, { count: number; amount: number }> = {};
    initial.forEach((b) => {
      const key = new Date(b.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
      if (!map[key]) map[key] = { count: 0, amount: 0 };
      map[key].count++; map[key].amount += Number(b.payment_amount);
    });
    return Object.entries(map);
  }, [initial]);

  return (
    <main className="min-h-screen p-4 sm:p-6"
      style={{ background: "linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)" }}>

      {editing && <EditModal booking={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); router.refresh(); }} />}
      {reading && <ReadingModal booking={reading} onClose={() => setReading(null)} />}

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
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>{error}</div>
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
            <h2 className="text-purple-300 text-xs uppercase tracking-widest font-medium mb-4">Month-wise Breakdown</h2>
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
          <input type="tel" placeholder="Search by phone number..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-10 py-3 rounded-xl text-sm text-white placeholder:text-white/30 outline-none"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
          {search && (
            <button onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xl">×</button>
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
                    <tr key={b.id} style={{
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
                    }}>
                      {/* Action buttons */}
                      <td className="pl-3 pr-1 py-3">
                        <div className="flex items-center gap-1">
                          {/* Edit */}
                          <button onClick={() => setEditing(b)} title="Edit booking"
                            className="p-1.5 rounded-lg text-white/30 hover:text-purple-400 hover:bg-purple-400/10 transition-all">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          {/* Send Reading */}
                          <button onClick={() => setReading(b)} title="Send reading"
                            className="p-1.5 rounded-lg text-white/30 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          </button>
                        </div>
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
                        {new Date(b.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
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
