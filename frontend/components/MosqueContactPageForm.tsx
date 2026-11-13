
"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type Props = {
  mosqueName: string;
};

export default function MosqueContactPageForm({
  mosqueName,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess(false);
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setSuccess(false);

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.subject ||
      !form.message.trim()
    ) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Veuillez saisir une adresse e-mail valide.");
      return;
    }

    setLoading(true);

    try {
      // Préparation du formulaire.
      // L'envoi à l'API Django sera ajouté ultérieurement.
      console.log("Message de contact :", {
        ...form,
        mosque: mosqueName,
      });

      setSuccess(true);

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch {
      setError(
        "Une erreur est survenue. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-xl font-extrabold text-gray-950">
          Envoyer un message
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Les champs marqués d&apos;un * sont obligatoires.
        </p>
      </div>

      {success && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4"
        >
          <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-700" />
          <div>
            <p className="font-bold text-emerald-900">
              Formulaire validé !
            </p>
            <p className="mt-1 text-sm text-emerald-800">
              L&apos;interface fonctionne. L&apos;envoi réel sera activé
              après connexion à l&apos;API.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <AlertCircle className="shrink-0" />
          {error}
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-bold text-gray-700">
          Nom et prénom *
        </label>

        <div className="relative">
          <User className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Votre nom complet"
            className={`${inputClass} pl-11`}
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-gray-700">
          Adresse e-mail *
        </label>

        <div className="relative">
          <Mail className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="exemple@email.com"
            className={`${inputClass} pl-11`}
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-gray-700">
          Téléphone
        </label>

        <div className="relative">
          <Phone className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+225 00 00 00 00 00"
            className={`${inputClass} pl-11`}
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-gray-700">
          Sujet *
        </label>

        <select
          name="subject"
          value={form.subject}
          onChange={handleChange}
          className={inputClass}
          required
        >
          <option value="">Choisir un sujet</option>
          <option value="Information générale">
            Information générale
          </option>
          <option value="Horaires de prière">
            Horaires de prière
          </option>
          <option value="Événements">
            Événements et activités
          </option>
          <option value="Dons">
            Dons et contributions
          </option>
          <option value="Mariage">
            Mariage et cérémonies
          </option>
          <option value="Suggestion">
            Suggestion
          </option>
          <option value="Autre">Autre</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-gray-700">
          Votre message *
        </label>

        <div className="relative">
          <MessageSquare className="absolute left-4 top-4 h-4 w-4 text-gray-400" />

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Écrivez votre message ici..."
            rows={6}
            maxLength={3000}
            className={`${inputClass} resize-y pl-11`}
            required
          />
        </div>

        <p className="mt-1 text-right text-xs text-gray-400">
          {form.message.length}/3000 caractères
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-emerald-800 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          "Envoi en cours..."
        ) : (
          <>
            <Send size={17} />
            Envoyer mon message
          </>
        )}
      </button>

      <p className="text-center text-xs leading-5 text-gray-400">
        Votre message est destiné à l&apos;administration de {mosqueName}.
      </p>
    </form>
  );
}