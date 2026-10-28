"use client";

import { useState } from "react";

import { apiPost } from "@/lib/api";

type ContactForm = {
  full_name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
};

export default function MosqueContactForm({
  mosqueSlug,
}: {
  mosqueSlug: string;
}) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const [form, setForm] = useState<ContactForm>({
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
      await apiPost(
        `/mosquees/${mosqueSlug}/contacts/`,
        form
      );

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
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold text-gray-950">
        Contacter cette mosquée
      </h2>

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
        value={form.phone}
        onChange={(value) =>
          setForm({ ...form, phone: value })
        }
      />

      <Field
        label="E-mail"
        type="email"
        value={form.email}
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
        <span className="mb-1 block text-sm font-semibold text-gray-800">
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
          className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none focus:border-emerald-400"
        />
      </label>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-xl bg-emerald-800 px-4 py-3 font-semibold text-white transition hover:bg-emerald-900 disabled:opacity-60"
      >
        {status === "loading"
          ? "Envoi..."
          : "Envoyer le message"}
      </button>

      {status === "success" && (
        <p className="text-emerald-700">
          Votre message a bien été envoyé à cette mosquée.
        </p>
      )}

      {status === "error" && (
        <p className="text-red-600">
          Une erreur est survenue. Réessayez.
        </p>
      )}
    </form>
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
      <span className="mb-1 block text-sm font-semibold text-gray-800">
        {label}
      </span>

      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none focus:border-emerald-400"
      />
    </label>
  );
}