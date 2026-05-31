"use client";

interface SubmitButtonProps {
  isLoading: boolean;
}

export default function SubmitButton({ isLoading }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`
        relative w-full py-4 px-6 rounded-xl font-semibold text-base
        transition-all duration-300 overflow-hidden group
        focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent
        ${
          isLoading
            ? "opacity-80 cursor-not-allowed"
            : "hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(139,51,255,0.5)] active:translate-y-0"
        }
      `}
      style={{
        background: isLoading
          ? "linear-gradient(135deg, #6b21a8, #4c1d95)"
          : "linear-gradient(135deg, #8b33ff 0%, #5c16c5 50%, #3d0f8a 100%)",
      }}
    >
      {/* Shimmer overlay */}
      {!isLoading && (
        <span
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s linear infinite",
          }}
        />
      )}

      <span className="relative flex items-center justify-center gap-2.5">
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>Booking Your Session...</span>
          </>
        ) : (
          <>
            <span>✦</span>
            <span>Confirm My Booking</span>
            <span>✦</span>
          </>
        )}
      </span>
    </button>
  );
}
