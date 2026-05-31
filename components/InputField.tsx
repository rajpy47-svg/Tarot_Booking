"use client";

interface InputFieldProps {
  label: string;
  id: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  icon?: React.ReactNode;
}

export default function InputField({
  label,
  id,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  icon,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium text-purple-200 tracking-wide"
      >
        {label}
        {required && <span className="text-purple-400 ml-1">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={!!error}
          className={`
            w-full rounded-xl px-4 py-3 text-white text-sm
            bg-white/5 border transition-all duration-200
            placeholder:text-white/30 outline-none
            ${icon ? "pl-10" : ""}
            ${
              error
                ? "border-red-400/70 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 bg-red-500/5"
                : "border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 hover:border-white/20"
            }
          `}
        />
      </div>
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
