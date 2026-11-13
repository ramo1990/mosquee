
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { apiPost } from "@/lib/api";
import type { ContactMessagePayload } from "@/lib/types";

export default function MosqueContactPage() {
  const params = useParams<{ slug: string }>();
  const mosqueSlug = params.slug;

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
      await apiPost("/contacts/mosquee/", {
        ...form,
        mosque_slug: mosqueSlug,
      });

      setStatus("success");

      setForm({
        full_name: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  function updateField(
    field: keyof ContactMessagePayload,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  return (
    <main className="min-h-dvh bg-gray-50 px-6 py-14">
      <div className="mx-auto max-w-2xl">

        <div className="mb-8">
          <span className="font-bold uppercase tracking-widest text-emerald-700 text-sm">
            Espace de contact
          </span>

          <h1 className="mt-3 text-4xl font-extrabold text-gray-950">
            Contacter cette mosquée
          </h1>

          <p className="mt-3 text-gray-600 leading-7">
            Envoyez directement votre message à l&apos;administration
            de cette mosquée. Elle pourra vous répondre dans
            les meilleurs délais.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <Field
            label="Nom complet"
            value={form.full_name}
            onChange={(value) => updateField("full_name", value)}
            required
          />

          <Field
            label="Téléphone"
            value={form.phone ?? ""}
            onChange={(value) => updateField("phone", value)}
          />

          <Field
            label="Adresse e-mail"
            type="email"
            value={form.email ?? ""}
            onChange={(value) => updateField("email", value)}
          />

          <Field
            label="Sujet"
            value={form.subject}
            onChange={(value) => updateField("subject", value)}
            required
          />

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-gray-800">
              Votre message
            </span>

            <textarea
              required
              rows={6}
              value={form.message}
              onChange={(event) =>
                updateField("message", event.target.value)
              }
              placeholder="Comment pouvons-nous vous aider ?"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-gray-900 outline-none focus:border-emerald-500"
            />
          </label>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-xl bg-emerald-800 px-5 py-4 font-bold text-white transition hover:bg-emerald-900 disabled:opacity-50"
          >
            {status === "loading"
              ? "Envoi en cours..."
              : "Envoyer mon message →"}
          </button>

          {status === "success" && (
            <p className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
              Votre message a bien été envoyé à la mosquée.
            </p>
          )}

          {status === "error" && (
            <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
              Une erreur est survenue lors de l&apos;envoi.
              Veuillez réessayer.
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
      <span className="mb-2 block text-sm font-semibold text-gray-800">
        {label}
      </span>

      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-gray-900 outline-none focus:border-emerald-500"
      />
    </label>
  );
}
