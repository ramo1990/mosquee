"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { apiPost } from "@/lib/api";

type RegisterFormData = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  password_confirm: string;
};

const initialData: RegisterFormData = {
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  password: "",
  password_confirm: "",
};

export default function RegisterPage() {
  const router = useRouter();

  const [data, setData] = useState<RegisterFormData>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function updateField<K extends keyof RegisterFormData>(
    field: K,
    value: RegisterFormData[K]
  ) {
    setData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function validate() {
    if (data.password !== data.password_confirm) {
      return "Les mots de passe ne correspondent pas.";
    }

    if (data.password.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caractères.";
    }

    return null;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await apiPost("/auth/register/", {
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        password_confirm: data.password_confirm,
      });

      router.push("/compte");
    } catch {
      setError(
        "Impossible de créer le compte. Vérifiez les informations saisies."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-emerald-950 px-4 py-10">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-xl sm:p-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-emerald-950">
            Mosquée<span className="text-amber-500">.</span>
          </h1>

          <h2 className="mt-3 text-xl font-bold text-gray-900">
            Créer un compte
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Rejoignez votre communauté et accédez aux informations de votre mosquée.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Prénom"
              value={data.first_name}
              onChange={(value) => updateField("first_name", value)}
            />

            <Field
              label="Nom"
              value={data.last_name}
              onChange={(value) => updateField("last_name", value)}
            />
          </div>

          <Field
            label="Nom d’utilisateur"
            value={data.username}
            required
            autoComplete="username"
            onChange={(value) => updateField("username", value)}
          />

          <Field
            label="Email"
            type="email"
            value={data.email}
            required
            autoComplete="email"
            onChange={(value) => updateField("email", value)}
          />

          <Field
            label="Téléphone"
            type="tel"
            value={data.phone}
            placeholder="+225 07 00 00 00 00"
            autoComplete="tel"
            onChange={(value) => updateField("phone", value)}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Mot de passe"
              type="password"
              value={data.password}
              required
              autoComplete="new-password"
              onChange={(value) => updateField("password", value)}
            />

            <Field
              label="Confirmer le mot de passe"
              type="password"
              value={data.password_confirm}
              required
              autoComplete="new-password"
              onChange={(value) => updateField("password_confirm", value)}
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-800 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-900 disabled:opacity-60"
          >
            {loading ? "Création du compte..." : "Créer mon compte"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Vous avez déjà un compte ?{" "}
          <Link
            href="/connexion"
            className="font-bold text-emerald-800 hover:underline"
          >
            Se connecter
          </Link>
        </p>
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
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-gray-800">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
      />
    </div>
  );
}