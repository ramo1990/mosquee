"use client";

import { useState } from "react";

import { apiPost } from "@/lib/api";

type DonationForm = {
  campaign: string;
  donor_name: string;
  donor_phone: string;
  donor_email: string;
  amount: string;
  donation_type: string;
  payment_method: string;
};

const initialState: DonationForm = {
  campaign: "",
  donor_name: "",
  donor_phone: "",
  donor_email: "",
  amount: "",
  donation_type: "sadaqah",
  payment_method: "orange_money",
};

export default function MosqueDonationForm({
  mosqueSlug,
  campaigns,
}: {
  mosqueSlug: string;
  campaigns: {
    slug: string;
    title: string;
  }[];
}) {
  const [form, setForm] = useState<DonationForm>(initialState);
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

    try {
      await apiPost(
        `/mosquees/${mosqueSlug}/dons/`,
        {
          campaign: form.campaign || null,
          donor_name: form.donor_name,
          donor_phone: form.donor_phone,
          donor_email: form.donor_email || null,
          amount: form.amount,
          donation_type: form.donation_type,
          payment_method: form.payment_method,
        }
      );

      setStatus("success");
      setForm(initialState);
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
        Faire un don
      </h2>

      <Field label="Campagne facultative">
        <select
          value={form.campaign}
          onChange={(event) =>
            setForm({ ...form, campaign: event.target.value })
          }
          className={inputClassName}
        >
          <option value="">Don général</option>

          {campaigns.map((campaign) => (
            <option key={campaign.slug} value={campaign.slug}>
              {campaign.title}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nom complet">
          <input
            required
            value={form.donor_name}
            onChange={(event) =>
              setForm({
                ...form,
                donor_name: event.target.value,
              })
            }
            className={inputClassName}
          />
        </Field>

        <Field label="Téléphone">
          <input
            required
            value={form.donor_phone}
            onChange={(event) =>
              setForm({
                ...form,
                donor_phone: event.target.value,
              })
            }
            className={inputClassName}
          />
        </Field>
      </div>

      <Field label="E-mail facultatif">
        <input
          type="email"
          value={form.donor_email}
          onChange={(event) =>
            setForm({
              ...form,
              donor_email: event.target.value,
            })
          }
          className={inputClassName}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Montant (FCFA)">
          <input
            type="number"
            min="100"
            step="100"
            required
            value={form.amount}
            onChange={(event) =>
              setForm({ ...form, amount: event.target.value })
            }
            className={inputClassName}
          />
        </Field>

        <Field label="Type de don">
          <select
            value={form.donation_type}
            onChange={(event) =>
              setForm({
                ...form,
                donation_type: event.target.value,
              })
            }
            className={inputClassName}
          >
            <option value="sadaqah">Sadaqa</option>
            <option value="zakat">Zakat</option>
            <option value="construction">Construction</option>
            <option value="maintenance">Entretien</option>
            <option value="other">Autre</option>
          </select>
        </Field>
      </div>

      <Field label="Moyen de paiement">
        <select
          value={form.payment_method}
          onChange={(event) =>
            setForm({
              ...form,
              payment_method: event.target.value,
            })
          }
          className={inputClassName}
        >
          <option value="orange_money">Orange Money</option>
          <option value="mtn_momo">MTN MoMo</option>
          <option value="moov_money">Moov Money</option>
          <option value="wave">Wave</option>
          <option value="bank_transfer">Virement bancaire</option>
          <option value="cash">Espèces</option>
        </select>
      </Field>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-xl bg-emerald-800 px-4 py-3 font-semibold text-white transition hover:bg-emerald-900 disabled:opacity-60"
      >
        {status === "loading" ? "Envoi..." : "Faire un don"}
      </button>

      {status === "success" && (
        <p className="text-emerald-700">
          Merci ! Votre don a été enregistré.
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