"use client";

import BookingForm from "./BookingForm";

const FEATURES = [
  { icon: "🔮", text: "Tarot Reading" },
  { icon: "✨", text: "Spell Casting" },
  { icon: "🌙", text: "Energy Healing" },
  { icon: "💫", text: "Guidance & Clarity" },
];

export default function BookingPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center py-10 px-4 z-10">
      {/* Ambient glow blobs */}
      <div
        className="fixed top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139,51,255,0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        aria-hidden="true"
      />
      <div
        className="fixed bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(79,38,178,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        aria-hidden="true"
      />

      <div className="w-full max-w-lg animate-slide-up">
        {/* Header section */}
        <div className="text-center mb-8">
          {/* Logo / Emblem */}
          <div className="flex justify-center mb-5">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
              style={{
                background: "linear-gradient(135deg, rgba(139,51,255,0.3), rgba(79,38,178,0.2))",
                border: "1px solid rgba(139,51,255,0.4)",
                boxShadow: "0 0 30px rgba(139,51,255,0.25)",
              }}
              aria-hidden="true"
            >
              🔮
            </div>
          </div>

          {/* Tagline */}
          <p className="text-purple-400 text-xs font-medium uppercase tracking-[0.3em] mb-3">
            Private Consultation
          </p>

          {/* Main heading */}
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight mb-3">
            Book Your Private{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #c084fc, #a855f7, #7c3aed)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Consultation
            </span>
          </h1>

          {/* Description */}
          <p className="text-white/50 text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
            Fill out the form below to secure your personalized session. I will
            review your details and connect with you personally.
          </p>

          {/* Feature chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {FEATURES.map((f) => (
              <span
                key={f.text}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full text-purple-200"
                style={{
                  background: "rgba(139,51,255,0.12)",
                  border: "1px solid rgba(139,51,255,0.2)",
                }}
              >
                <span>{f.icon}</span>
                {f.text}
              </span>
            ))}
          </div>
        </div>

        {/* Form card */}
        <div
          className="rounded-2xl p-6 sm:p-8"
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow:
              "0 25px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(139,51,255,0.1), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          {/* Card top accent line */}
          <div
            className="h-px w-full rounded mb-6 opacity-60"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(139,51,255,0.8), transparent)",
            }}
            aria-hidden="true"
          />

          <BookingForm />

          {/* Card bottom divider */}
          <div
            className="h-px w-full rounded mt-6 opacity-30"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
            }}
            aria-hidden="true"
          />

          <p className="text-center text-xs text-white/25 mt-4">
            Secured with SSL • 100% Confidential
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-white/20 mt-6">
          &copy; {new Date().getFullYear()} Tarot & Spell Services. All rights reserved.
        </p>
      </div>
    </main>
  );
}
