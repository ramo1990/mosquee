
"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";
import type { ContactMessagePayload } from "@/lib/types";

type Status = "idle" | "loading" | "success" | "error";

const INITIAL_FORM: ContactMessagePayload = {
  full_name: "",
  phone: "",
  email: "",
  subject: "",
  message: "",
};

const CONTACT_SUBJECTS = [
  "Problème technique",
  "Question générale",
  "Suggestion",
  "Signalement",
  "Partenariat",
  "Autre",
];

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#07110e]/80 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10";

export default function ContactPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] =
    useState<ContactMessagePayload>(INITIAL_FORM);

  function updateField(
    field: keyof ContactMessagePayload,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
    if (status !== "idle") setStatus("idle");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (status === "loading") return;

    setStatus("loading");

    try {
      await apiPost("/contacts/", form);
      setForm({ ...INITIAL_FORM });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="min-h-dvh bg-[#07110e] px-4 py-14 text-white sm:px-6">
      <div className="mx-auto max-w-5xl">

        {/* En-tête */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-7 w-7 text-emerald-400"
            >
              <path d="M4 5h16v14H4z" />
              <path d="m4 7 8 6 8-6" />
            </svg>
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
            Assistance & communication
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Nous contacter
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
            Une question, une suggestion ou un problème sur
            notre plateforme ? Notre équipe administrative est
            à votre écoute. Envoyez-nous votre message et nous
            vous répondrons dans les meilleurs délais.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.5fr]">

          {/* Informations */}
          <aside className="space-y-5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
              <h2 className="text-lg font-bold">
                Comment pouvons-nous vous aider ?
              </h2>

              <p className="mt-3 text-sm leading-7 text-white/50">
                Ce formulaire est destiné à contacter
                directement les administrateurs du site.
                N&apos;hésitez pas à nous faire part de vos
                remarques et suggestions.
              </p>

              <div className="mt-7 space-y-5">
                <InfoItem
                  icon="✉"
                  title="Une question ?"
                  description="Posez-nous vos questions concernant le fonctionnement du site."
                />

                <InfoItem
                  icon="⚙"
                  title="Un problème technique ?"
                  description="Signalez tout dysfonctionnement rencontré sur la plateforme."
                />

                <InfoItem
                  icon="✦"
                  title="Une suggestion ?"
                  description="Vos idées nous aident à améliorer notre service."
                />
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/6 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
                <span>●</span>
                Votre avis compte
              </div>
              <p className="mt-2 text-sm leading-6 text-white/55">
                Chaque message est important. Merci de
                contribuer à l&apos;amélioration de notre plateforme.
              </p>
            </div>
          </aside>

          {/* Formulaire */}
          <section className="rounded-2xl border border-white/10 bg-white/4.5 p-5 shadow-2xl shadow-black/20 sm:p-8">
            <div className="mb-7">
              <h2 className="text-xl font-bold">
                Envoyer un message
              </h2>
              <p className="mt-2 text-sm text-white/45">
                Les champs marqués d&apos;un * sont obligatoires.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Nom complet"
                  placeholder="Votre nom et prénom"
                  value={form.full_name}
                  onChange={(v) => updateField("full_name", v)}
                  required
                />

                <Field
                  label="Téléphone"
                  placeholder="+225 07 00 00 00 00"
                  value={form.phone ?? ""}
                  onChange={(v) => updateField("phone", v)}
                />
              </div>

              <Field
                label="Adresse e-mail"
                type="email"
                placeholder="exemple@email.com"
                value={form.email ?? ""}
                onChange={(v) => updateField("email", v)}
              />

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-white/85">
                  Motif de contact
                  <span className="ml-1 text-emerald-400">*</span>
                </span>

                <select
                  required
                  value={form.subject}
                  onChange={(event) =>
                    updateField("subject", event.target.value)
                  }
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  <option value="" disabled className="bg-[#07110e]">
                    Sélectionnez un motif
                  </option>

                  {CONTACT_SUBJECTS.map((subject) => (
                    <option
                      key={subject}
                      value={subject}
                      className="bg-[#07110e] text-white"
                    >
                      {subject}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-white/85">
                  Votre message <span className="text-emerald-400">*</span>
                </span>

                <textarea
                  required
                  rows={6}
                  minLength={10}
                  maxLength={5000}
                  placeholder="Décrivez votre demande avec le plus de détails possible..."
                  value={form.message}
                  onChange={(event) =>
                    updateField("message", event.target.value)
                  }
                  className={`${inputClass} resize-y`}
                />

                <span className="mt-2 block text-right text-xs text-white/35">
                  {form.message.length}/5000 caractères
                </span>
              </label>

              {/* Retour utilisateur */}
              {status === "success" && (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4"
                >
                  <span className="text-emerald-400">✓</span>
                  <div>
                    <p className="text-sm font-semibold text-emerald-300">
                      Message envoyé avec succès !
                    </p>
                    <p className="mt-1 text-xs text-emerald-200/60">
                      Merci de nous avoir contactés. Votre message
                      a bien été transmis à notre équipe.
                    </p>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300"
                >
                  Une erreur est survenue lors de l&apos;envoi.
                  Vérifiez votre connexion et réessayez.
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-600 px-5 py-4 text-sm font-bold text-white transition hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07110e] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === "loading" ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    Envoyer mon message
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </button>

              <p className="text-center text-xs leading-5 text-white/35">
                Vos informations sont utilisées uniquement
                pour traiter votre demande.
              </p>
            </form>
          </section>
        </div>

        <p className="mt-12 text-center text-xs text-white/25">
          Merci pour votre confiance.
        </p>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-white/85">
        {label}
        {required && (
          <span className="ml-1 text-emerald-400">*</span>
        )}
      </span>

      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
    </label>
  );
}

function InfoItem({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-lg text-emerald-400">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="mt-1 text-xs leading-6 text-white/45">
          {description}
        </p>
      </div>
    </div>
  );
}

// TODO: Ajouter une référence de message après l'envoi, pour permettre au visiteur de retrouver sa demande.
// Prévoir une protection anti-spam côté backend (limitation de fréquence, validation et éventuellement CAPTCHA).
// Envoyer une notification aux administrateurs à chaque nouveau message.