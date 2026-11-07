"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { apiGetCurrentUser, apiPatch, apiPatchForm } from "@/lib/api";
import type { User } from "@/lib/types";

type ProfileFormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

const initialData: ProfileFormData = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
};

export default function EditProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<ProfileFormData>(initialData);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    apiGetCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);

        setData({
          first_name: currentUser.first_name ?? "",
          last_name: currentUser.last_name ?? "",
          email: currentUser.email ?? "",
          phone: currentUser.phone ?? "",
        });

        setPhotoPreview(currentUser.photo ?? null);
      })
      .catch(() => {
        setError("Impossible de charger votre profil.");
      })
      .finally(() => setLoading(false));
  }, []);

  function updateField<K extends keyof ProfileFormData>(
    field: K,
    value: ProfileFormData[K]
  ) {
    setData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    setPhoto(file);

    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      let updatedUser: User;

      if (photo) {
        const formData = new FormData();

        formData.append("first_name", data.first_name);
        formData.append("last_name", data.last_name);
        formData.append("email", data.email);
        formData.append("phone", data.phone);
        formData.append("photo", photo);

        updatedUser = await apiPatchForm<User>("/auth/me/", formData);
      } else {
        updatedUser = await apiPatch<User>("/auth/me/", data);
      }

      setUser(updatedUser);
      setPhoto(null);
      setSuccess("Profil mis à jour avec succès.");

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Impossible de mettre à jour le profil."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">Chargement du profil...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-gray-50 px-4">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-gray-900">
            Vous n’êtes pas connecté
          </h1>

          <Link
            href="/connexion"
            className="mt-4 inline-block rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white"
          >
            Se connecter
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/compte"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-800 transition hover:underline"
        >
          ← Retour au profil
        </Link>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-extrabold text-gray-950">
            Modifier mon profil
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Mettez à jour vos informations personnelles et votre photo.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Photo */}
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Photo de profil"
                  className="h-24 w-24 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-emerald-100 text-3xl font-black text-emerald-800">
                  {(user.first_name || user.username)
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

              <div className="w-full">
                <label
                  htmlFor="photo"
                  className="mb-1.5 block text-sm font-semibold text-gray-800"
                >
                  Photo de profil
                </label>

                <input
                  ref={fileInputRef}
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-800 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Formats acceptés : JPG, PNG ou WEBP.
                </p>
              </div>
            </div>

            {/* Informations */}
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
              label="Email"
              type="email"
              value={data.email}
              onChange={(value) => updateField("email", value)}
            />

            <Field
              label="Téléphone"
              type="tel"
              value={data.phone}
              placeholder="+225 07 00 00 00 00"
              onChange={(value) => updateField("phone", value)}
            />

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </p>
            )}

            {success && (
              <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                {success}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-xl bg-emerald-800 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-900 disabled:opacity-60"
              >
                {saving ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>

              <Link
                href="/compte"
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-center text-sm font-bold text-gray-700 transition hover:bg-gray-50"
              >
                Annuler
              </Link>
            </div>
          </form>
        </div>
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-gray-800">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
      />
    </div>
  );
}