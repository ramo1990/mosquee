// src/app/contact/page.tsx
"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    const formData = new FormData(event.currentTarget);

    try {
      await apiPost("/contacts/send/", {
        full_name: formData.get("full_name"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message"),
      });

      setStatus("success");
      setMessage("Votre message a bien été envoyé.");
      event.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Une erreur est survenue."
      );
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold">Contact</h1>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
        <input
          name="full_name"
          placeholder="Nom complet"
          required
          className="w-full rounded-lg border p-3"
        />

        <input
          name="phone"
          placeholder="Téléphone"
          className="w-full rounded-lg border p-3"
        />

        <input
          name="email"
          type="email"
          placeholder="E-mail"
          className="w-full rounded-lg border p-3"
        />

        <input
          name="subject"
          placeholder="Sujet"
          required
          className="w-full rounded-lg border p-3"
        />

        <textarea
          name="message"
          placeholder="Votre message"
          required
          rows={5}
          className="w-full rounded-lg border p-3"
        />

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-lg bg-emerald-700 p-3 font-semibold text-white disabled:opacity-60"
        >
          {status === "loading" ? "Envoi..." : "Envoyer"}
        </button>

        {message && (
          <p
            className={`text-sm ${
              status === "success" ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}