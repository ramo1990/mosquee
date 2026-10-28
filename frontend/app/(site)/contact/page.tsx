"use client";

import { useState } from "react";

import { apiPost } from "@/lib/api";
import type { ContactMessagePayload } from "@/lib/types";

export default function ContactPage() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const [form, setForm] = useState<ContactMessagePayload>({
    full_name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setStatus("loading");

    try {
      await apiPost("/contacts/", form);
      setStatus("success");

      setForm({
        full_name: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="min-h-dvh bg-[#07110e] px-6 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold">Nous contacter</h1>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <Field
            label="Nom complet"
            value={form.full_name}
            onChange={(value) =>
              setForm({ ...form, full_name: value })
            }
            required
          />

          <Field
            label="Téléphone"
            value={form.phone ?? ""}
            onChange={(value) =>
              setForm({ ...form, phone: value })
            }
          />

          <Field
            label="E-mail"
            type="email"
            value={form.email ?? ""}
            onChange={(value) =>
              setForm({ ...form, email: value })
            }
          />

          <Field
            label="Sujet"
            value={form.subject}
            onChange={(value) =>
              setForm({ ...form, subject: value })
            }
            required
          />

          <label className="block">
            <span className="mb-1 block text-sm font-semibold">
              Message
            </span>

            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(event) =>
                setForm({
                  ...form,
                  message: event.target.value,
                })
              }
              className="w-full rounded-xl border border-white/10 bg-black/30 p-3 outline-none focus:border-emerald-400"
            />
          </label>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-bold transition hover:bg-emerald-500 disabled:opacity-60"
          >
            {status === "loading"
              ? "Envoi..."
              : "Envoyer le message"}
          </button>

          {status === "success" && (
            <p className="text-emerald-300">
              Votre message a bien été envoyé.
            </p>
          )}

          {status === "error" && (
            <p className="text-red-400">
              Une erreur est survenue. Réessayez.
            </p>
          )}
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold">
        {label}
      </span>

      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black/30 p-3 outline-none focus:border-emerald-400"
      />
    </label>
  );
}