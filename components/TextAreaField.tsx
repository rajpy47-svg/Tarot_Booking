"use client";

interface TextAreaFieldProps {
  label: string;
  id: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  required?: boolean;
  rows?: number;
  maxLength?: number;
}

export default function TextAreaField({
  label,
  id,
  name,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  rows = 4,
  maxLength,
}: TextAreaFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <label
          htmlFor={id}
          className="text-sm font-medium text-purple-200 tracking-wide"
        >
          {label}
          {required && <span className="text-purple-400 ml-1">*</span>}
        </label>
        {maxLength && (
          <span
            className={`text-xs tabular-nums ${
              value.length > maxLength * 0.9
                ? "text-amber-400"
                : "text-white/40"
            }`}
          >
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        maxLength={maxLength}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
        className={`
          w-full rounded-xl px-4 py-3 text-white text-sm resize-none
          bg-white/5 border transition-all duration-200
          placeholder:text-white/30 outline-none
          ${
            error
              ? "border-red-400/70 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 bg-red-500/5"
              : "border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 hover:border-white/20"
          }
        `}
      />
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs text-red-400 flex items-center gap-1 mt-0.5"
        >
          <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
