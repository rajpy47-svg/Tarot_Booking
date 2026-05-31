"use client";

import { useState } from "react";
import InputField from "./InputField";
import TextAreaField from "./TextAreaField";
import SubmitButton from "./SubmitButton";
import SuccessMessage from "./SuccessMessage";

interface FormData {
  fullName: string;
  dateOfBirth: string;
  partnerName: string;
  phone: string;
  problemDescription: string;
  paymentAmount: string;
}

interface FormErrors {
  fullName?: string;
  dateOfBirth?: string;
  phone?: string;
  problemDescription?: string;
  paymentAmount?: string;
}

const initialForm: FormData = {
  fullName: "",
  dateOfBirth: "",
  partnerName: "",
  phone: "",
  problemDescription: "",
  paymentAmount: "",
};

/* Icons */
const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const PhoneIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);
const HeartIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);
const CurrencyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

function validate(form: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!form.fullName.trim()) {
    errors.fullName = "Full name is required";
  } else if (form.fullName.trim().length < 2) {
    errors.fullName = "Name must be at least 2 characters";
  }

  if (!form.dateOfBirth) {
    errors.dateOfBirth = "Date of birth is required";
  } else {
    const dob = new Date(form.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    if (isNaN(dob.getTime())) {
      errors.dateOfBirth = "Enter a valid date";
    } else if (age < 18) {
      errors.dateOfBirth = "You must be at least 18 years old";
    } else if (dob > today) {
      errors.dateOfBirth = "Date cannot be in the future";
    }
  }

  if (!form.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^\+?[\d\s\-().]{7,15}$/.test(form.phone)) {
    errors.phone = "Enter a valid phone number";
  }

  if (!form.problemDescription.trim()) {
    errors.problemDescription = "Please describe your situation briefly";
  } else if (form.problemDescription.trim().length < 20) {
    errors.problemDescription = "Please provide at least 20 characters";
  }

  if (!form.paymentAmount.trim()) {
    errors.paymentAmount = "Please enter the total amount you will pay";
  } else if (isNaN(Number(form.paymentAmount)) || Number(form.paymentAmount) <= 0) {
    errors.paymentAmount = "Enter a valid amount (numbers only)";
  }

  return errors;
}

export default function BookingForm() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState<{ id: string; name: string } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);

    if (touched[name as keyof FormData]) {
      const newErrors = validate(updated);
      setErrors((prev) => ({ ...prev, [name]: newErrors[name as keyof FormErrors] }));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validate(form);
    setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allTouched = Object.keys(form).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as Partial<Record<keyof FormData, boolean>>
    );
    setTouched(allTouched);

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorField = document.querySelector("[aria-invalid='true']") as HTMLElement;
      firstErrorField?.focus();
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const data = await response.json();
        setBookingResult({ id: data.bookingId, name: form.fullName });
      } else {
        throw new Error("Booking failed");
      }
    } catch {
      /* Backend not yet connected — simulate success for UI preview */
      const mockId = String(Math.floor(100000 + Math.random() * 900000));
      setBookingResult({ id: mockId, name: form.fullName });
    } finally {
      setIsLoading(false);
    }
  };

  if (bookingResult) {
    return <SuccessMessage bookingId={bookingResult.id} name={bookingResult.name} />;
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Booking form">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="sm:col-span-2">
          <InputField
            label="Full Name"
            id="fullName"
            name="fullName"
            placeholder="Your full name"
            value={form.fullName}
            onChange={handleChange}
            error={touched.fullName ? errors.fullName : undefined}
            required
            icon={<UserIcon />}
          />
        </div>

        {/* Date of Birth */}
        <div onBlur={() => handleBlur("dateOfBirth")}>
          <InputField
            label="Date of Birth"
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={form.dateOfBirth}
            onChange={handleChange}
            error={touched.dateOfBirth ? errors.dateOfBirth : undefined}
            required
            icon={<CalendarIcon />}
          />
        </div>

        {/* Partner Name */}
        <div>
          <InputField
            label="Partner Name"
            id="partnerName"
            name="partnerName"
            placeholder="Partner's name (if applicable)"
            value={form.partnerName}
            onChange={handleChange}
            icon={<HeartIcon />}
          />
        </div>

        {/* Phone */}
        <div className="sm:col-span-2" onBlur={() => handleBlur("phone")}>
          <InputField
            label="Phone Number"
            id="phone"
            name="phone"
            type="tel"
            placeholder="+91 00000 00000"
            value={form.phone}
            onChange={handleChange}
            error={touched.phone ? errors.phone : undefined}
            required
            icon={<PhoneIcon />}
          />
        </div>

        {/* Problem Description */}
        <div className="sm:col-span-2" onBlur={() => handleBlur("problemDescription")}>
          <TextAreaField
            label="Brief Problem Description"
            id="problemDescription"
            name="problemDescription"
            placeholder="Describe your situation, what you're seeking help with, or any specific questions you have..."
            value={form.problemDescription}
            onChange={handleChange}
            error={touched.problemDescription ? errors.problemDescription : undefined}
            required
            rows={4}
            maxLength={500}
          />
        </div>

        {/* Total Payment Amount */}
        <div className="sm:col-span-2" onBlur={() => handleBlur("paymentAmount")}>
          <InputField
            label="Total Payment Amount"
            id="paymentAmount"
            name="paymentAmount"
            type="number"
            placeholder="Enter amount (e.g. 2500)"
            value={form.paymentAmount}
            onChange={handleChange}
            error={touched.paymentAmount ? errors.paymentAmount : undefined}
            required
            icon={<CurrencyIcon />}
          />
        </div>
      </div>

      {/* Privacy note */}
      <p className="text-xs text-white/30 text-center mt-5 mb-1">
        Your information is kept strictly confidential and never shared.
      </p>

      {/* Submit */}
      <div className="mt-4">
        <SubmitButton isLoading={isLoading} />
      </div>
    </form>
  );
}
