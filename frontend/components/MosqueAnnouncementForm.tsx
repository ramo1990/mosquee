"use client";

import { useState } from "react";

import { apiPostForm } from "@/lib/api";

type FormState = {
  target_type: "all" | "group" | "screen";
  target_group: string;
  target_screen: string;
  title: string;
  body: string;
  priority: "low" | "normal" | "high";
  is_active: boolean;
  show_on_screen: boolean;
  starts_at: string;
  ends_at: string;
  image: File | null;
};

const initialState: FormState = {
  target_type: "all",
  target_group: "",
  target_screen: "",
  title: "",
  body: "",
  priority: "normal",
  is_active: true,
  show_on_screen: true,
  starts_at: "",
  ends_at: "",
  image: null,
};

export default function MosqueAnnouncementForm({
  mosqueSlug,
  onCreated,
}: {
  mosqueSlug: string;
  onCreated?: () => void;
}) {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setStatus("loading");
    setErrorMessage(null);

    const payload = new FormData();

    payload.append("mosque", mosqueSlug);
    payload.append("target_type", form.target_type);
    payload.append("title", form.title);
    payload.append("body", form.body);
    payload.append("priority", form.priority);
    payload.append("is_active", String(form.is_active));
    payload.append("show_on_screen", String(form.show_on_screen));

    if (form.starts_at) {
      payload.append("starts_at", form.starts_at);
    }

    if (form.ends_at) {
      payload.append("ends_at", form.ends_at);
    }

    if (form.target_type === "group" && form.target_group) {
      payload.append("target_group", form.target_group);
    }

    if (form.target_type === "screen" && form.target_screen) {
      payload.append("target_screen", form.target_screen);
    }

    if (form.image) {
      payload.append("image", form.image);
    }

    try {
      await apiPostForm("/annonces/", payload);

      setStatus("success");
      setForm(initialState);

      onCreated?.();
    } catch (error) {
      setStatus("error");

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue."
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold text-gray-950">
        Créer une annonce
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Titre">
          <input
            required
            value={form.title}
            onChange={(event) =>
              setForm({ ...form, title: event.target.value })
            }
            className={inputClassName}
          />
        </Field>

        <Field label="Priorité">
          <select
            value={form.priority}
            onChange={(event) =>
              setForm({
                ...form,
                priority: event.target
                  .value as FormState["priority"],
              })
            }
            className={inputClassName}
          >
            <option value="low">Basse</option>
            <option value="normal">Normale</option>
            <option value="high">Urgente</option>
          </select>
        </Field>
      </div>

      <Field label="Contenu">
        <textarea
          required
          rows={5}
          value={form.body}
          onChange={(event) =>
            setForm({ ...form, body: event.target.value })
          }
          className={inputClassName}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Début d’affichage">
          <input
            type="datetime-local"
            value={form.starts_at}
            onChange={(event) =>
              setForm({ ...form, starts_at: event.target.value })
            }
            className={inputClassName}
          />
        </Field>

        <Field label="Fin d’affichage">
          <input
            type="datetime-local"
            value={form.ends_at}
            onChange={(event) =>
              setForm({ ...form, ends_at: event.target.value })
            }
            className={inputClassName}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Cible">
          <select
            value={form.target_type}
            onChange={(event) =>
              setForm({
                ...form,
                target_type: event.target
                  .value as FormState["target_type"],
              })
            }
            className={inputClassName}
          >
            <option value="all">Tous les écrans</option>
            <option value="group">Groupe d’écrans</option>
            <option value="screen">Écran précis</option>
          </select>
        </Field>

        {form.target_type === "group" && (
          <Field label="ID du groupe">
            <input
              type="number"
              required
              value={form.target_group}
              onChange={(event) =>
                setForm({
                  ...form,
                  target_group: event.target.value,
                })
              }
              className={inputClassName}
            />
          </Field>
        )}

        {form.target_type === "screen" && (
          <Field label="ID de l’écran">
            <input
              type="number"
              required
              value={form.target_screen}
              onChange={(event) =>
                setForm({
                  ...form,
                  target_screen: event.target.value,
                })
              }
              className={inputClassName}
            />
          </Field>
        )}
      </div>

      <Field label="Image facultative">
        <input
          type="file"
          accept="image/*"
          onChange={(event) =>
            setForm({
              ...form,
              image: event.target.files?.[0] ?? null,
            })
          }
          className={inputClassName}
        />
      </Field>

      <div className="flex flex-wrap gap-6">
        <Checkbox
          label="Annonce active"
          checked={form.is_active}
          onChange={(value) =>
            setForm({ ...form, is_active: value })
          }
        />

        <Checkbox
          label="Afficher sur l’écran"
          checked={form.show_on_screen}
          onChange={(value) =>
            setForm({ ...form, show_on_screen: value })
          }
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-xl bg-emerald-800 px-4 py-3 font-semibold text-white transition hover:bg-emerald-900 disabled:opacity-60"
      >
        {status === "loading"
          ? "Création..."
          : "Créer l’annonce"}
      </button>

      {status === "success" && (
        <p className="text-emerald-700">
          L’annonce a bien été créée.
        </p>
      )}

      {status === "error" && (
        <p className="text-red-600">
          {errorMessage ?? "Une erreur est survenue."}
        </p>
      )}
    </form>
  );
}

const inputClassName =
  "w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none focus:border-emerald-400";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-gray-800">
        {label}
      </span>

      {children}
    </label>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-gray-800">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-gray-300"
      />

      {label}
    </label>
  );
}