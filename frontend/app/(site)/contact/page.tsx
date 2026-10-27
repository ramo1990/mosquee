
"use client";

import { useState, type FormEvent } from "react";
import { apiPost } from "@/lib/api";

type FormStatus = "idle" | "loading" | "success" | "error";

const inputClassName =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-gray-50";

const labelClassName = "mb-2 block text-sm font-semibold text-gray-800";

export default function ContactPage() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status === "loading") return;

    // Conserver la référence avant le premier await.
    const form = event.currentTarget;
    const formData = new FormData(form);

    const fullName = String(formData.get("full_name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const subject = String(formData.get("subject") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!fullName || !subject || !message) {
      setStatus("error");
      setFeedback("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setStatus("loading");
    setFeedback("");

    try {
      await apiPost("/contacts/send/", {
        full_name: fullName,
        phone,
        email,
        subject,
        message,
      });

      form.reset();
      setStatus("success");
      setFeedback(
        "Votre message a bien été envoyé. Merci de nous avoir contactés !"
      );
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire :", error);

      setStatus("error");
      setFeedback(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue. Veuillez réessayer."
      );
    }
  }

  const isLoading = status === "loading";

  return (
    <div className="mx-auto max-w-3xl py-4 sm:py-8">
      {/* En-tête */}
      <header className="mb-8">
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
          Nous sommes à votre écoute
        </span>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
          Contactez-nous
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
          Une question sur les horaires de prière, les activités ou les
          événements de la mosquée ? Envoyez-nous votre message. Nous
          serons heureux de vous répondre.
        </p>
      </header>

      {/* Formulaire */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="mb-6 border-b border-gray-100 pb-5">
          <h2 className="text-lg font-bold text-gray-900">
            Envoyer un message
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Les champs marqués d’un astérisque (*) sont obligatoires.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          aria-busy={isLoading}
        >
          {/* Nom */}
          <div>
            <label htmlFor="full_name" className={labelClassName}>
              Nom complet <span className="text-red-600">*</span>
            </label>

            <input
              id="full_name"
              name="full_name"
              type="text"
              autoComplete="name"
              placeholder="Ex. : Amadou Koné"
              required
              maxLength={150}
              disabled={isLoading}
              className={inputClassName}
            />
          </div>

          {/* Téléphone et e-mail */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="phone" className={labelClassName}>
                Téléphone
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="Ex. : +225 07 00 00 00 00"
                maxLength={30}
                disabled={isLoading}
                className={inputClassName}
              />
              <p className="mt-1.5 text-xs text-gray-500">
                Facultatif
              </p>
            </div>

            <div>
              <label htmlFor="email" className={labelClassName}>
                Adresse e-mail
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="vous@exemple.com"
                maxLength={254}
                disabled={isLoading}
                className={inputClassName}
              />
              <p className="mt-1.5 text-xs text-gray-500">
                Facultatif
              </p>
            </div>
          </div>

          {/* Sujet */}
          <div>
            <label htmlFor="subject" className={labelClassName}>
              Sujet <span className="text-red-600">*</span>
            </label>

            <input
              id="subject"
              name="subject"
              type="text"
              placeholder="Objet de votre demande"
              required
              maxLength={200}
              disabled={isLoading}
              className={inputClassName}
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className={labelClassName}>
              Votre message <span className="text-red-600">*</span>
            </label>

            <textarea
              id="message"
              name="message"
              placeholder="Écrivez votre message ici..."
              required
              minLength={10}
              maxLength={5000}
              rows={6}
              disabled={isLoading}
              className={`${inputClassName} min-h-36 resize-y`}
            />

            <p className="mt-1.5 text-xs text-gray-500">
              Décrivez votre demande en quelques phrases.
            </p>
          </div>

          {/* Retour de soumission */}
          {feedback && (
            <div
              role={status === "error" ? "alert" : "status"}
              aria-live={status === "error" ? "assertive" : "polite"}
              className={`rounded-xl border p-4 text-sm leading-6 ${
                status === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : status === "error"
                    ? "border-red-200 bg-red-50 text-red-800"
                    : "border-gray-200 bg-gray-50 text-gray-700"
              }`}
            >
              <p className="font-medium">{feedback}</p>
            </div>
          )}

          {/* Bouton */}
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
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
                    className="opacity-90"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Envoi en cours...
              </>
            ) : (
              <>
                Envoyer mon message
                <span aria-hidden="true">→</span>
              </>
            )}
          </button>

          <p className="text-center text-xs leading-5 text-gray-500">
            Vos informations sont utilisées pour traiter votre demande.
          </p>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        Merci de votre intérêt pour notre communauté.
      </p>
    </div>
  );
}
