
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Heart,
  HandHeart,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Wallet,
  Building2,
  Sparkles,
} from "lucide-react";

import { apiGetCurrentUser } from "@/lib/api";
import type { User } from "@/lib/types";

const AMOUNTS = [1000, 2000, 5000, 10000, 20000];

const PROJECTS = [
  {
    id: "construction",
    name: "Construction et rénovation",
    description: "Construction et entretien de la mosquée.",
  },
  {
    id: "education",
    name: "Éducation islamique",
    description: "Soutenir les cours et l'apprentissage religieux.",
  },
  {
    id: "social",
    name: "Aide aux personnes nécessiteuses",
    description: "Accompagner les familles dans le besoin.",
  },
  {
    id: "general",
    name: "Don général",
    description: "Contribuer aux besoins de la mosquée.",
  },
];

const PAYMENT_METHODS = [
  "Wave",
  "Orange Money",
  "MTN Money",
  "Moov Money",
];

export default function DonationsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [amount, setAmount] = useState("5000");
  const [project, setProject] = useState("general");
  const [paymentMethod, setPaymentMethod] = useState("Wave");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    apiGetCurrentUser()
      .then((data) => {
        if (!active) return;

        setUser(data);
        setFullName(
          [data.first_name, data.last_name].filter(Boolean).join(" ") ||
            data.username
        );
        setEmail(data.email ?? "");
        setPhone(data.phone ?? "");
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoadingUser(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const selectedProject = PROJECTS.find(
    (item) => item.id === project
  );

  const numericAmount = Number(amount);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    if (!Number.isFinite(numericAmount) || numericAmount < 100) {
      setError("Veuillez saisir un montant valide d'au moins 100 FCFA.");
      return;
    }

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError("Veuillez renseigner toutes vos informations.");
      return;
    }

    // Le formulaire est prêt pour être connecté à l'API
    // et à un prestataire de paiement.
    setError(
      "Le paiement en ligne n'est pas encore activé. Votre formulaire est prêt pour l'intégration du service de paiement."
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 px-4 py-16 text-white sm:py-20">
        <div className="relative z-10 mx-auto max-w-5xl">
          <Link
            href="/espace-fidele"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-200 hover:text-white"
          >
            <ArrowLeft size={17} />
            Retour à mon espace
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <HandHeart size={30} />
            </div>

            <span className="text-sm font-bold uppercase tracking-widest text-emerald-200">
              Solidarité et générosité
            </span>
          </div>

          <h1 className="mt-7 max-w-2xl text-3xl font-extrabold sm:text-5xl">
            Soutenez votre mosquée, participez à son avenir.
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-emerald-100 sm:text-base">
            Chaque don contribue au développement de notre communauté,
            à l&apos;éducation religieuse et aux actions de solidarité.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 text-sm text-emerald-100">
            <span className="flex items-center gap-2">
              <ShieldCheck size={18} />
              Don sécurisé à mettre en place
            </span>
            <span className="flex items-center gap-2">
              <Heart size={18} />
              Chaque contribution compte
            </span>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full border-[40px] border-white/5" />
      </section>

      {/* CONTENU */}
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_360px] lg:px-8">

        {/* FORMULAIRE */}
        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900">
              Faire un don
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Complétez les informations pour préparer votre contribution.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* MONTANT */}
            <div>
              <label className="mb-4 block text-sm font-bold text-gray-900">
                1. Choisissez le montant de votre don
              </label>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {AMOUNTS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setAmount(String(value))}
                    className={`rounded-xl border px-4 py-4 text-sm font-extrabold transition ${
                      amount === String(value)
                        ? "border-emerald-800 bg-emerald-800 text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-emerald-500"
                    }`}
                  >
                    {value.toLocaleString("fr-FR")} FCFA
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <label
                  htmlFor="amount"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Ou saisir un montant libre
                </label>

                <div className="relative">
                  <input
                    id="amount"
                    type="number"
                    min="100"
                    step="50"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-4 pr-20 text-lg font-bold text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">
                    FCFA
                  </span>
                </div>
              </div>
            </div>

            {/* PROJET */}
            <div>
              <label
                htmlFor="project"
                className="mb-3 block text-sm font-bold text-gray-900"
              >
                2. Quel projet souhaitez-vous soutenir ?
              </label>

              <div className="space-y-3">
                {PROJECTS.map((item) => (
                  <label
                    key={item.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                      project === item.id
                        ? "border-emerald-600 bg-emerald-50"
                        : "border-gray-200 hover:border-emerald-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="project"
                      value={item.id}
                      checked={project === item.id}
                      onChange={() => setProject(item.id)}
                      className="mt-1 accent-emerald-800"
                    />

                    <span>
                      <span className="block text-sm font-bold text-gray-900">
                        {item.name}
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        {item.description}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* DONATEUR */}
            <div>
              <h3 className="mb-4 text-sm font-bold text-gray-900">
                3. Vos informations
              </h3>

              {loadingUser ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Chargement de vos informations...
                </div>
              ) : (
                <div className="space-y-4">
                  <Field
                    label="Nom complet"
                    value={fullName}
                    onChange={setFullName}
                    required
                  />

                  <Field
                    label="Adresse email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    required
                  />

                  <Field
                    label="Numéro de téléphone"
                    type="tel"
                    value={phone}
                    onChange={setPhone}
                    placeholder="+225 07 00 00 00 00"
                    required
                  />
                </div>
              )}

              {!user && !loadingUser && (
                <p className="mt-3 text-xs text-gray-500">
                  Vous pouvez également faire un don sans être connecté.
                </p>
              )}
            </div>

            {/* PAIEMENT */}
            <div>
              <label className="mb-3 block text-sm font-bold text-gray-900">
                4. Moyen de paiement souhaité
              </label>

              <div className="grid grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`rounded-xl border p-4 text-sm font-bold transition ${
                      paymentMethod === method
                        ? "border-emerald-700 bg-emerald-50 text-emerald-900"
                        : "border-gray-200 text-gray-600 hover:border-emerald-400"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* MESSAGES */}
            {error && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
                Don enregistré.
              </div>
            )}

            {/* VALIDATION */}
            <button
              type="submit"
              disabled={submitting || loadingUser}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-800 px-6 py-4 text-sm font-extrabold text-white transition hover:bg-emerald-900 disabled:opacity-50"
            >
              <Heart size={19} />
              Continuer avec mon don
            </button>

            <p className="text-center text-xs leading-relaxed text-gray-400">
              Aucune transaction ne sera effectuée tant que le service
              de paiement n&apos;aura pas été intégré.
            </p>
          </form>
        </section>

        {/* RÉCAPITULATIF */}
        <aside className="space-y-5">
          <div className="sticky top-24 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 font-extrabold text-gray-900">
              <Wallet className="text-emerald-700" size={20} />
              Récapitulatif
            </h2>

            <div className="mt-6 rounded-2xl bg-emerald-50 p-5 text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Votre contribution
              </p>

              <p className="mt-2 text-3xl font-extrabold text-emerald-900">
                {(Number.isFinite(numericAmount) ? numericAmount : 0).toLocaleString("fr-FR")}
              </p>

              <p className="text-sm font-bold text-emerald-700">
                FCFA
              </p>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div>
                <p className="text-gray-400">Projet soutenu</p>
                <p className="mt-1 font-bold text-gray-900">
                  {selectedProject?.name}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-gray-400">Moyen de paiement</p>
                <p className="mt-1 font-bold text-gray-900">
                  {paymentMethod}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-gray-400">Donateur</p>
                <p className="mt-1 font-bold text-gray-900">
                  {fullName || "Non renseigné"}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-gray-50 p-4">
              <div className="flex gap-3">
                <ShieldCheck className="shrink-0 text-emerald-700" size={20} />
                <p className="text-xs leading-relaxed text-gray-500">
                  Vos informations seront utilisées pour le suivi de votre
                  contribution. Le paiement sécurisé sera activé lors de
                  l&apos;intégration du prestataire.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-amber-50 p-5">
            <Sparkles className="text-amber-600" size={23} />
            <h3 className="mt-3 font-bold text-gray-900">
              Chaque don compte
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Votre générosité participe à faire vivre votre mosquée et
              à renforcer les liens de notre communauté.
            </p>
          </div>

          <Link
            href="/espace-fidele"
            className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 hover:text-emerald-800"
          >
            <Building2 size={17} />
            Retour à mon espace fidèle
          </Link>
        </aside>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
      />
    </div>
  );
}