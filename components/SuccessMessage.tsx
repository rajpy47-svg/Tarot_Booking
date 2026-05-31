"use client";

interface SuccessMessageProps {
  bookingId: string;
  name: string;
}

export default function SuccessMessage({ bookingId, name }: SuccessMessageProps) {
  return (
    <div
      className="flex flex-col items-center text-center py-8 px-4 animate-fade-in"
      role="status"
      aria-live="polite"
    >
      {/* Animated checkmark */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(139,51,255,0.3), rgba(79,38,178,0.2))",
            border: "2px solid rgba(139,51,255,0.5)",
            boxShadow: "0 0 40px rgba(139,51,255,0.3)",
          }}
        >
          <svg
            className="w-12 h-12 text-purple-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        {/* Decorative rings */}
        <div className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{ background: "rgba(139,51,255,0.4)" }}
        />
      </div>

      {/* Stars decoration */}
      <div className="flex gap-2 text-xl mb-4" aria-hidden="true">
        <span className="animate-float" style={{ animationDelay: "0s" }}>✦</span>
        <span className="animate-float" style={{ animationDelay: "0.3s" }}>✧</span>
        <span className="animate-float" style={{ animationDelay: "0.6s" }}>✦</span>
      </div>

      <h2 className="font-serif text-3xl font-bold text-white mb-2">
        Booking Confirmed!
      </h2>
      <p className="text-purple-200 text-base mb-6 max-w-xs">
        Dear{" "}
        <span className="text-white font-semibold">{name.split(" ")[0]}</span>,
        your session has been received. I will reach out to you shortly.
      </p>

      {/* Booking ID card */}
      <div
        className="w-full max-w-xs rounded-xl px-6 py-4 mb-6"
        style={{
          background: "rgba(139,51,255,0.15)",
          border: "1px solid rgba(139,51,255,0.3)",
        }}
      >
        <p className="text-xs text-purple-300 uppercase tracking-widest mb-1">
          Your Booking ID
        </p>
        <p className="text-xl font-mono font-bold text-white tracking-wider">
          {bookingId}
        </p>
        <p className="text-xs text-white/40 mt-1">Save this for your records</p>
      </div>

      <p className="text-sm text-white/40">
        I will contact you on your phone number shortly.
      </p>
    </div>
  );
}
