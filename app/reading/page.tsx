"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface Reading {
  id: number;
  day: number;
  message: string;
  image_url: string | null;
  created_at: string;
}

const AFFIRMATIONS = [
  "I am worthy of deep love, healing, and unlimited abundance.",
  "Everything I desire is already making its way to me — I trust the process.",
  "I release what no longer serves me and welcome infinite blessings into my life.",
  "I am aligned with the energy of success, peace, and joy.",
  "The universe is always working in my favour — miracles are normal in my life.",
];

export default function ReadingPage() {
  const [bookingId, setBookingId] = useState("");
  const [clientName, setClientName] = useState("");
  const [readings, setReadings] = useState<Reading[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const search = async () => {
    const id = bookingId.trim();
    if (!id) return;
    setLoading(true); setNotFound(false); setReadings(null); setClientName("");

    const { data: booking } = await supabase
      .from("bookings").select("booking_id, full_name").eq("booking_id", id).single();

    if (!booking) { setNotFound(true); setLoading(false); return; }

    setClientName(booking.full_name);

    const { data } = await supabase
      .from("readings").select("*").eq("booking_id", id).order("day");

    setReadings(data ?? []);
    setLoading(false);
  };

  const firstName = clientName.split(" ")[0];

  return (
    <main className="relative min-h-screen flex flex-col items-center py-12 px-4 z-10"
      style={{ background: "linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)" }}>

      <div className="fixed top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(139,51,255,0.15) 0%,transparent 70%)", filter: "blur(40px)" }} />

      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
              style={{ background: "linear-gradient(135deg,rgba(139,51,255,0.3),rgba(79,38,178,0.2))", border: "1px solid rgba(139,51,255,0.4)" }}>
              ✨
            </div>
          </div>
          <p className="text-purple-400 text-xs uppercase tracking-widest mb-2">Your Personal Reading</p>
          <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "Georgia, serif" }}>
            View Your Reading
          </h1>
          <p className="text-white/40 text-sm">Enter your booking ID to access your personal reading</p>
        </div>

        {/* Search box */}
        <div className="rounded-2xl p-6 mb-6"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <label className="text-purple-300 text-sm font-medium block mb-2">Your Booking ID</label>
          <div className="flex gap-3">
            <input
              type="text" maxLength={6} placeholder="e.g. 483201"
              value={bookingId} onChange={(e) => setBookingId(e.target.value.replace(/\D/, ""))}
              onKeyDown={(e) => e.key === "Enter" && search()}
              className="flex-1 rounded-xl px-4 py-3 text-white text-lg font-mono tracking-widest outline-none placeholder:text-white/20 placeholder:text-base placeholder:tracking-normal"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
            />
            <button onClick={search} disabled={loading || bookingId.length < 6}
              className="px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40"
              style={{ background: "linear-gradient(135deg,#8b33ff,#5c16c5)" }}>
              {loading ? "…" : "View"}
            </button>
          </div>
        </div>

        {/* Not found */}
        {notFound && (
          <div className="text-center py-8 rounded-2xl"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <p className="text-red-400 text-sm">No booking found with ID <span className="font-mono font-bold">{bookingId}</span></p>
            <p className="text-white/30 text-xs mt-1">Please check your booking ID and try again</p>
          </div>
        )}

        {/* Welcome + affirmations — shows as soon as name is found */}
        {clientName && (
          <div className="rounded-2xl p-6 mb-6 animate-fade-in"
            style={{ background: "linear-gradient(135deg,rgba(139,51,255,0.18),rgba(79,38,178,0.12))", border: "1px solid rgba(139,51,255,0.35)" }}>

            {/* Welcome message */}
            <div className="text-center mb-5">
              <p className="text-2xl mb-3">🌟</p>
              <h2 className="text-white font-bold text-xl mb-2" style={{ fontFamily: "Georgia, serif" }}>
                Welcome, {firstName}
              </h2>
              <p className="text-purple-200 text-sm leading-relaxed">
                We are here to heal, guide, and uplift you. You are not alone on this journey —
                the universe has a beautiful plan for you and every step forward brings you closer
                to the life you truly deserve.
              </p>
            </div>

            {/* Divider */}
            <div className="h-px my-4"
              style={{ background: "linear-gradient(90deg,transparent,rgba(139,51,255,0.5),transparent)" }} />

            {/* Affirmations */}
            <div>
              <p className="text-purple-400 text-xs uppercase tracking-widest text-center mb-4">
                ✦ Your Daily Affirmations ✦
              </p>
              <div className="space-y-3">
                {AFFIRMATIONS.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl px-4 py-3"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <span className="text-purple-400 mt-0.5 flex-shrink-0 text-xs">✦</span>
                    <p className="text-white/75 text-sm leading-relaxed italic">
                      &ldquo;{firstName}, {a}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-center text-white/30 text-xs mt-4">
                Repeat these every morning for 21 days to shift your energy
              </p>
            </div>
          </div>
        )}

        {/* Reading not ready yet */}
        {readings !== null && readings.length === 0 && (
          <div className="text-center py-10 rounded-2xl"
            style={{ background: "rgba(139,51,255,0.08)", border: "1px solid rgba(139,51,255,0.2)" }}>
            <p className="text-3xl mb-3">🔮</p>
            <p className="text-white font-semibold mb-1">Your reading is being prepared, {firstName}</p>
            <p className="text-white/40 text-sm">Please check back soon. Your personal reading will appear here once ready.</p>
          </div>
        )}

        {/* Readings */}
        {readings && readings.length > 0 && (
          <div className="space-y-5">
            <p className="text-purple-300 text-xs uppercase tracking-widest text-center">
              {readings.length} Reading{readings.length !== 1 ? "s" : ""} Available
            </p>
            {readings.map((r) => (
              <div key={r.id} className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,51,255,0.25)" }}>
                <div className="flex items-center gap-3 px-5 py-3"
                  style={{ background: "rgba(139,51,255,0.15)", borderBottom: "1px solid rgba(139,51,255,0.2)" }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: "linear-gradient(135deg,#8b33ff,#5c16c5)" }}>
                    {r.day}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">Day {r.day} Reading</p>
                    <p className="text-white/30 text-xs">
                      {new Date(r.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <span className="ml-auto text-lg">✦</span>
                </div>
                {r.image_url && (
                  <img src={r.image_url} alt={`Day ${r.day} reading`} className="w-full max-h-72 object-cover" />
                )}
                <div className="px-5 py-4">
                  <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{r.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
