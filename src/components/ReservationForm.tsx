"use client";

import { useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { formatTime, restaurant } from "@/config/restaurant";
import { CheckIcon } from "./Icons";

type Fields = {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  notes: string;
};
type FieldName = keyof Fields;
type Errors = Partial<Record<FieldName, string>>;

const empty: Fields = { name: "", email: "", phone: "", date: "", time: "", guests: "2", notes: "" };
const order: FieldName[] = ["name", "email", "phone", "date", "time", "guests", "notes"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
const NOTES_MAX = 500;
const BOOKING_WINDOW_DAYS = 90;

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const fromMinutes = (n: number) => `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;

/** "YYYY-MM-DD" in the visitor's local time zone */
const isoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parseDate = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

function hoursFor(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const day = WEEKDAYS[parseDate(date).getDay()];
  return restaurant.hours.find((h) => (h.days as readonly string[]).includes(day)) ?? null;
}

/** 30-minute slots from opening until one hour before closing, within the reservation window. */
function slotsFor(date: string): string[] {
  const h = hoursFor(date);
  if (!h || !h.opens || !h.closes) return [];
  const start = Math.max(toMinutes(h.opens), toMinutes(restaurant.reservations.earliest));
  const end = Math.min(toMinutes(h.closes) - 60, toMinutes(restaurant.reservations.latest));
  const slots: string[] = [];
  for (let t = start; t <= end; t += 30) slots.push(fromMinutes(t));
  return slots;
}

function validate(f: Fields, today: string): Errors {
  const e: Errors = {};
  const name = f.name.trim();
  if (!name) e.name = "Please enter your name.";
  else if (name.length < 2) e.name = "Your name should be at least 2 characters.";

  if (!f.email.trim()) e.email = "Please enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim()))
    e.email = "Please enter a valid email address, like name@example.com.";

  const digits = f.phone.replace(/\D/g, "");
  if (!digits) e.phone = "Please enter a phone number so we can reach you.";
  else if (!(digits.length === 10 || (digits.length === 11 && digits.startsWith("1"))))
    e.phone = "Please enter a 10-digit US phone number, like (718) 555-0142.";

  if (!f.date) e.date = "Please choose a date.";
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(f.date)) e.date = "Please choose a valid date.";
  else if (today && f.date < today) e.date = "Please choose a date that isn't in the past.";
  else {
    const limit = new Date();
    limit.setDate(limit.getDate() + BOOKING_WINDOW_DAYS);
    const h = hoursFor(f.date);
    if (f.date > isoDate(limit)) e.date = `We take reservations up to ${BOOKING_WINDOW_DAYS} days in advance.`;
    else if (!h?.opens) e.date = `Sorry, we're closed on ${WEEKDAYS[parseDate(f.date).getDay()]}s. Please pick another day.`;
  }

  if (!f.time) e.time = "Please choose a time.";
  else if (!e.date && !slotsFor(f.date).includes(f.time)) e.time = "Please choose one of the available times.";
  else if (!e.date && f.date === today) {
    const now = new Date();
    if (toMinutes(f.time) <= now.getHours() * 60 + now.getMinutes() + 30)
      e.time = "That time has already passed or is too soon. Please choose a later time.";
  }

  const guests = Number(f.guests);
  if (!Number.isInteger(guests) || guests < 1 || guests > restaurant.reservations.maxGuests)
    e.guests = `Please choose between 1 and ${restaurant.reservations.maxGuests} guests.`;

  if (f.notes.length > NOTES_MAX) e.notes = `Please keep notes under ${NOTES_MAX} characters.`;
  return e;
}

const inputBase =
  "mt-2 block w-full rounded-xl border bg-cream-50 px-4 py-3 text-base text-ink placeholder:text-ink-soft/70 transition-colors focus:border-olive-600 focus:outline-none focus-visible:ring-3 focus-visible:ring-olive-600/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60";

export function ReservationForm() {
  const uid = useId();
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [submitted, setSubmitted] = useState<Fields | null>(null);
  const [today, setToday] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Dates depend on the visitor's clock, so compute them after hydration (the page is statically exported).
  useEffect(() => {
    const now = new Date();
    const max = new Date();
    max.setDate(max.getDate() + BOOKING_WINDOW_DAYS);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-only initialization
    setToday(isoDate(now));
    setMaxDate(isoDate(max));
  }, []);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const slots = useMemo(() => slotsFor(fields.date), [fields.date]);
  const id = (f: FieldName) => `${uid}-${f}`;
  const errId = (f: FieldName) => `${uid}-${f}-error`;

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const name = e.target.name as FieldName;
    const next = { ...fields, [name]: e.target.value };
    // Reset the time when the chosen slot doesn't exist on the new date.
    if (name === "date" && next.time && !slotsFor(next.date).includes(next.time)) next.time = "";
    setFields(next);
    // Re-validate fields the visitor already interacted with, so errors clear as soon as they're fixed.
    const all = validate(next, today);
    setErrors((prev) => {
      const updated: Errors = {};
      for (const k of order) if ((touched[k] || prev[k]) && all[k]) updated[k] = all[k];
      return updated;
    });
  };

  const onBlur = (name: FieldName) => {
    setTouched((t) => ({ ...t, [name]: true }));
    const all = validate(fields, today);
    setErrors((prev) => ({ ...prev, [name]: all[name] }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const all = validate(fields, today);
    setErrors(all);
    setTouched(Object.fromEntries(order.map((k) => [k, true])));
    const firstInvalid = order.find((k) => all[k]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    setStatus("submitting");
    // Demo only: no data leaves the browser. Replace with a real booking API or form service.
    await new Promise((r) => setTimeout(r, 700));
    setSubmitted(fields);
    setStatus("success");
  };

  const reset = () => {
    setFields(empty);
    setErrors({});
    setTouched({});
    setSubmitted(null);
    setStatus("idle");
  };

  const describedBy = (f: FieldName, hint?: string) =>
    [hint, errors[f] ? errId(f) : null].filter(Boolean).join(" ") || undefined;

  const fieldClass = (f: FieldName) =>
    `${inputBase} ${errors[f] ? "border-tomato-600" : "border-cream-300 hover:border-ink-soft/50"}`;

  const errorText = (f: FieldName) =>
    errors[f] ? (
      <p id={errId(f)} className="mt-1.5 text-sm font-medium text-tomato-700">
        {errors[f]}
      </p>
    ) : null;

  if (status === "success" && submitted) {
    const prettyDate = parseDate(submitted.date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    const guests = Number(submitted.guests);
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-3xl bg-cream-50 p-8 text-center shadow-[0_20px_50px_-30px_rgba(43,33,28,0.5)] motion-safe:animate-fade-up sm:p-12"
      >
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-olive-600 text-cream-50">
          <CheckIcon width={32} height={32} />
        </span>
        <h3 className="mt-6 text-3xl font-semibold">Grazie, {submitted.name.trim().split(/\s+/)[0]}!</h3>
        <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-ink-soft">
          Your request for <strong className="text-ink">{guests} {guests === 1 ? "guest" : "guests"}</strong> on{" "}
          <strong className="text-ink">{prettyDate}</strong> at{" "}
          <strong className="text-ink">{formatTime(submitted.time)}</strong> has been received. We&rsquo;ll confirm by
          email at <strong className="text-ink break-all">{submitted.email.trim()}</strong>.
        </p>
        <p className="mt-4 text-sm text-ink-soft">(This is a demo — no reservation was actually sent.)</p>
        <button type="button" onClick={reset} className="btn-secondary mt-8">
          Make another reservation
        </button>
      </div>
    );
  }

  const dateHint = `${uid}-date-hint`;
  const notesHint = `${uid}-notes-hint`;

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      aria-labelledby="reserve-title"
      className="rounded-3xl bg-cream-50 p-6 shadow-[0_20px_50px_-30px_rgba(43,33,28,0.5)] sm:p-10"
    >
      <p className="text-sm text-ink-soft">
        All fields are required unless marked <span className="italic">optional</span>.
      </p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={id("name")} className="font-semibold">
            Full name
          </label>
          <input
            id={id("name")}
            name="name"
            type="text"
            autoComplete="name"
            required
            value={fields.name}
            onChange={onChange}
            onBlur={() => onBlur("name")}
            aria-invalid={!!errors.name}
            aria-describedby={describedBy("name")}
            className={fieldClass("name")}
          />
          {errorText("name")}
        </div>

        <div>
          <label htmlFor={id("email")} className="font-semibold">
            Email
          </label>
          <input
            id={id("email")}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={fields.email}
            onChange={onChange}
            onBlur={() => onBlur("email")}
            aria-invalid={!!errors.email}
            aria-describedby={describedBy("email")}
            className={fieldClass("email")}
          />
          {errorText("email")}
        </div>

        <div>
          <label htmlFor={id("phone")} className="font-semibold">
            Phone
          </label>
          <input
            id={id("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(718) 555-0142"
            required
            value={fields.phone}
            onChange={onChange}
            onBlur={() => onBlur("phone")}
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy("phone")}
            className={fieldClass("phone")}
          />
          {errorText("phone")}
        </div>

        <div>
          <label htmlFor={id("date")} className="font-semibold">
            Date
          </label>
          <input
            id={id("date")}
            name="date"
            type="date"
            required
            min={today || undefined}
            max={maxDate || undefined}
            value={fields.date}
            onChange={onChange}
            onBlur={() => onBlur("date")}
            aria-invalid={!!errors.date}
            aria-describedby={describedBy("date", dateHint)}
            className={fieldClass("date")}
          />
          <p id={dateHint} className="mt-1.5 text-sm text-ink-soft">
            Closed Mondays.
          </p>
          {errorText("date")}
        </div>

        <div>
          <label htmlFor={id("time")} className="font-semibold">
            Time
          </label>
          <select
            id={id("time")}
            name="time"
            required
            disabled={slots.length === 0}
            value={fields.time}
            onChange={onChange}
            onBlur={() => onBlur("time")}
            aria-invalid={!!errors.time}
            aria-describedby={describedBy("time")}
            className={`${fieldClass("time")} appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='%235b4d44'%20stroke-width='2'%3E%3Cpath%20d='m6%209%206%206%206-6'/%3E%3C/svg%3E")] bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat pr-10`}
          >
            <option value="">{fields.date ? (slots.length ? "Select a time" : "No times available") : "Choose a date first"}</option>
            {slots.map((s) => (
              <option key={s} value={s}>
                {formatTime(s)}
              </option>
            ))}
          </select>
          {errorText("time")}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={id("guests")} className="font-semibold">
            Number of guests
          </label>
          <select
            id={id("guests")}
            name="guests"
            required
            value={fields.guests}
            onChange={onChange}
            onBlur={() => onBlur("guests")}
            aria-invalid={!!errors.guests}
            aria-describedby={describedBy("guests", `${uid}-guests-hint`)}
            className={`${fieldClass("guests")} appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='%235b4d44'%20stroke-width='2'%3E%3Cpath%20d='m6%209%206%206%206-6'/%3E%3C/svg%3E")] bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat pr-10 sm:max-w-[calc(50%-0.75rem)]`}
          >
            {Array.from({ length: restaurant.reservations.maxGuests }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
          <p id={`${uid}-guests-hint`} className="mt-1.5 text-sm text-ink-soft">
            {restaurant.reservations.largePartyNote}
          </p>
          {errorText("guests")}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={id("notes")} className="font-semibold">
            Notes <span className="font-normal text-ink-soft italic">(optional)</span>
          </label>
          <textarea
            id={id("notes")}
            name="notes"
            rows={4}
            value={fields.notes}
            onChange={onChange}
            onBlur={() => onBlur("notes")}
            aria-invalid={!!errors.notes}
            aria-describedby={describedBy("notes", notesHint)}
            placeholder="Allergies, a birthday, a high chair…"
            className={`${fieldClass("notes")} resize-y`}
          />
          <p id={notesHint} className="mt-1.5 text-right text-sm text-ink-soft">
            {fields.notes.length}/{NOTES_MAX}
          </p>
          {errorText("notes")}
        </div>
      </div>

      <button type="submit" disabled={status === "submitting"} className="btn-primary mt-8 w-full disabled:opacity-70 sm:w-auto">
        {status === "submitting" ? "Sending…" : "Request reservation"}
      </button>
      <p className="mt-4 text-sm text-ink-soft">
        Demo form: your details stay in your browser and are not sent anywhere.
      </p>
    </form>
  );
}
