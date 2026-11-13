
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
  User,
  X,
  Save,
  ShieldCheck,
} from "lucide-react";

import {
  apiGetCurrentUser,
  apiPatch,
  apiPatchForm,
} from "@/lib/api";

import type { User as UserType } from "@/lib/types";
import Image from "next/image";


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

  const [user, setUser] = useState<UserType | null>(null);
  const [data, setData] = useState<ProfileFormData>(initialData);

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    apiGetCurrentUser()
      .then((currentUser) => {
        if (!active) return;

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
        if (active) {
          setError("Impossible de charger votre profil.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (photoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  function updateField<K extends keyof ProfileFormData>(
    field: K,
    value: ProfileFormData[K]
  ) {
    setData((current) => ({
      ...current,
      [field]: value,
    }));

    setError(null);
    setSuccess(null);
  }

  function handlePhotoChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner une image valide.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("La photo ne doit pas dépasser 5 Mo.");
      event.target.value = "";
      return;
    }

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setRemovePhoto(false);
    setError(null);
    setSuccess(null);
  }

  function handleRemovePhoto() {
    setPhoto(null);
    setPhotoPreview(null);
    setRemovePhoto(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (saving) return;

    setError(null);
    setSuccess(null);

    if (!data.first_name.trim()) {
      setError("Le prénom est obligatoire.");
      return;
    }

    if (!data.last_name.trim()) {
      setError("Le nom est obligatoire.");
      return;
    }

    if (
      data.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
    ) {
      setError("Veuillez saisir une adresse email valide.");
      return;
    }

    setSaving(true);

    try {
      let updatedUser: UserType;

      if (photo || removePhoto) {
        const formData = new FormData();

        formData.append("first_name", data.first_name.trim());
        formData.append("last_name", data.last_name.trim());
        formData.append("email", data.email.trim());
        formData.append("phone", data.phone.trim());

        if (photo) {
          formData.append("photo", photo);
        }

        // À adapter selon le nom du champ accepté par ton API.
        if (removePhoto) {
          formData.append("photo", "");
        }

        updatedUser = await apiPatchForm<UserType>(
          "/auth/me/",
          formData
        );
      } else {
        updatedUser = await apiPatch<UserType>(
          "/auth/me/",
          {
            first_name: data.first_name.trim(),
            last_name: data.last_name.trim(),
            email: data.email.trim(),
            phone: data.phone.trim(),
          }
        );
      }

      setUser(updatedUser);
      setData({
        first_name: updatedUser.first_name ?? "",
        last_name: updatedUser.last_name ?? "",
        email: updatedUser.email ?? "",
        phone: updatedUser.phone ?? "",
      });

      setPhoto(null);
      setRemovePhoto(false);
      setPhotoPreview(updatedUser.photo ?? null);

      setSuccess("Votre profil a été mis à jour avec succès.");

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la mise à jour."
      );
    } finally {
      setSaving(false);
    }
  }

  const fullName = user
    ? [user.first_name, user.last_name]
        .filter(Boolean)
        .join(" ") || user.username
    : "";

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto animate-spin text-emerald-800" size={36} />
          <p className="mt-4 text-sm text-gray-500">
            Chargement de votre profil...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <ShieldCheck className="mx-auto text-emerald-800" size={42} />

          <h1 className="mt-4 text-xl font-bold text-gray-900">
            Connexion requise
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Connectez-vous pour modifier votre profil.
          </p>

          <Link
            href="/connexion"
            className="mt-6 inline-flex rounded-xl bg-emerald-800 px-6 py-3 text-sm font-bold text-white"
          >
            Se connecter
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-3xl">

        <Link
          href="/compte"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-emerald-800"
        >
          <ArrowLeft size={18} />
          Retour à mon profil
        </Link>

        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

          {/* EN-TÊTE */}
          <div className="bg-linear-to-r from-emerald-900 to-emerald-800 px-6 py-8 text-white sm:px-8">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/10 p-3">
                <User size={25} />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold">
                  Modifier mon profil
                </h1>

                <p className="mt-1 text-sm text-emerald-100">
                  Gérez vos informations personnelles.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 p-6 sm:p-8">

            {/* PHOTO */}
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                Photo de profil
              </h2>

              <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row">
                <div className="relative">
                  {photoPreview ? (
                    <Image
                      src={photoPreview}
                      alt="Photo de profil"
                      width={96}
                      height={96}
                      unoptimized
                      className="h-24 w-24 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-emerald-100 text-4xl font-black text-emerald-800">
                      {fullName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Changer la photo"
                    className="absolute -bottom-2 -right-2 rounded-xl bg-emerald-800 p-2 text-white shadow-md hover:bg-emerald-900"
                  >
                    <Camera size={18} />
                  </button>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <p className="font-bold text-gray-900">
                    {fullName}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Choisissez une photo pour personnaliser votre compte.
                  </p>

                  <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-lg border border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-50"
                    >
                      Choisir une photo
                    </button>

                    {photoPreview && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="flex items-center gap-1 rounded-lg border border-red-200 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-50"
                      >
                        <X size={14} />
                        Retirer
                      </button>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    JPG, PNG ou WEBP · 5 Mo maximum
                  </p>
                </div>
              </div>
            </section>

            <div className="border-t border-gray-100" />

            {/* INFORMATIONS */}
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                Informations personnelles
              </h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field
                  label="Prénom"
                  value={data.first_name}
                  placeholder="Votre prénom"
                  onChange={(value) => updateField("first_name", value)}
                  required
                />

                <Field
                  label="Nom"
                  value={data.last_name}
                  placeholder="Votre nom"
                  onChange={(value) => updateField("last_name", value)}
                  required
                />
              </div>

              <div className="mt-5">
                <Field
                  label="Adresse email"
                  type="email"
                  value={data.email}
                  placeholder="exemple@email.com"
                  onChange={(value) => updateField("email", value)}
                  icon={<Mail size={18} />}
                />
              </div>

              <div className="mt-5">
                <Field
                  label="Téléphone"
                  type="tel"
                  value={data.phone}
                  placeholder="+225 07 00 00 00 00"
                  onChange={(value) => updateField("phone", value)}
                  icon={<Phone size={18} />}
                />
              </div>
            </section>

            {/* MESSAGES */}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                role="status"
                className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
              >
                <CheckCircle2 size={18} />
                {success}
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
              <Link
                href="/compte"
                className="rounded-xl border border-gray-200 px-6 py-3 text-center text-sm font-bold text-gray-600 transition hover:bg-gray-50"
              >
                Annuler
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Enregistrer les modifications
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        <p className="mt-5 text-center text-xs text-gray-400">
          Vos informations personnelles sont utilisées pour gérer votre compte.
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
  placeholder,
  icon,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-800">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        <input
          type={type}
          value={value}
          placeholder={placeholder}
          required={required}
          onChange={(event) => onChange(event.target.value)}
          className={`w-full rounded-xl border border-gray-200 bg-gray-50 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100 ${
            icon ? "pl-11 pr-4" : "px-4"
          }`}
        />
      </div>
    </div>
  );
}
