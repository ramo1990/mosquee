"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

type PrayerTime = {
  id: number;
  date: string;
  fajr?: string;
  dhuhr?: string;
  asr?: string;
  maghrib?: string;
  isha?: string;
  fajr_iqama?: string;
  dhuhr_iqama?: string;
  asr_iqama?: string;
  maghrib_iqama?: string;
  isha_iqama?: string;
  jumua_time?: string;
  jumua_khutbah_time?: string;
  notes?: string;
  is_active: boolean;
};

type PrayerTimeForm = {
  date: string;
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  fajr_iqama: string;
  dhuhr_iqama: string;
  asr_iqama: string;
  maghrib_iqama: string;
  isha_iqama: string;
  jumua_time: string;
  jumua_khutbah_time: string;
  notes: string;
};

const EMPTY_FORM: PrayerTimeForm = {
  date: new Date().toISOString().slice(0, 10),
  fajr: "",
  dhuhr: "",
  asr: "",
  maghrib: "",
  isha: "",
  fajr_iqama: "",
  dhuhr_iqama: "",
  asr_iqama: "",
  maghrib_iqama: "",
  isha_iqama: "",
  jumua_time: "",
  jumua_khutbah_time: "",
  notes: "",
};

const PRAYER_FIELDS = [
  "fajr",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
] as const;

const PRAYER_LABELS: Record<(typeof PRAYER_FIELDS)[number], string> = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

export default function PrayerTimesManagement() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<PrayerTimeForm>(EMPTY_FORM);

  const loadPrayerTimes = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<PrayerTime[]>("/prayer-times/");

      setPrayerTimes(data);
    } catch (err) {
      console.error("Erreur chargement des horaires de prière :", err);
      setPrayerTimes([]);
      setError(
        "Impossible de charger les horaires de prière pour le moment."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await apiGetList<PrayerTime[]>("/prayer-times/");

        if (!ignore) {
          setPrayerTimes(data);
        }
      } catch (err) {
        console.error("Erreur chargement des horaires de prière :", err);

        if (!ignore) {
          setPrayerTimes([]);
          setError(
            "Impossible de charger les horaires de prière pour le moment."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredPrayerTimes = useMemo(() => {
    const query = search.toLowerCase().trim();

    return prayerTimes
      .filter((prayerTime) => {
        const matchesSearch =
          !query ||
          [
            prayerTime.date,
            prayerTime.notes,
          ].some((value) => value?.toLowerCase().includes(query));

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" && prayerTime.is_active) ||
          (statusFilter === "inactive" && !prayerTime.is_active);

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [prayerTimes, search, statusFilter]);

  const activeCount = prayerTimes.filter(
    (prayerTime) => prayerTime.is_active
  ).length;

  const inactiveCount = prayerTimes.length - activeCount;

  function updateForm(field: keyof PrayerTimeForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function openCreateForm() {
    setForm({
      ...EMPTY_FORM,
      date: new Date().toISOString().slice(0, 10),
    });

    setEditingId(null);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  function openEditForm(prayerTime: PrayerTime) {
    setForm({
      date: prayerTime.date,
      fajr: prayerTime.fajr ?? "",
      dhuhr: prayerTime.dhuhr ?? "",
      asr: prayerTime.asr ?? "",
      maghrib: prayerTime.maghrib ?? "",
      isha: prayerTime.isha ?? "",
      fajr_iqama: prayerTime.fajr_iqama ?? "",
      dhuhr_iqama: prayerTime.dhuhr_iqama ?? "",
      asr_iqama: prayerTime.asr_iqama ?? "",
      maghrib_iqama: prayerTime.maghrib_iqama ?? "",
      isha_iqama: prayerTime.isha_iqama ?? "",
      jumua_time: prayerTime.jumua_time ?? "",
      jumua_khutbah_time: prayerTime.jumua_khutbah_time ?? "",
      notes: prayerTime.notes ?? "",
    });

    setEditingId(prayerTime.id);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const payload = {
      date: form.date,
      fajr: form.fajr || undefined,
      dhuhr: form.dhuhr || undefined,
      asr: form.asr || undefined,
      maghrib: form.maghrib || undefined,
      isha: form.isha || undefined,
      fajr_iqama: form.fajr_iqama || undefined,
      dhuhr_iqama: form.dhuhr_iqama || undefined,
      asr_iqama: form.asr_iqama || undefined,
      maghrib_iqama: form.maghrib_iqama || undefined,
      isha_iqama: form.isha_iqama || undefined,
      jumua_time: form.jumua_time || undefined,
      jumua_khutbah_time: form.jumua_khutbah_time || undefined,
      notes: form.notes.trim() || undefined,
    };

    try {
      if (editingId) {
        const updatedPrayerTime = await apiPatch<PrayerTime>(
          `/prayer-times/${editingId}/`,
          payload
        );

        setPrayerTimes((current) =>
          current.map((item) =>
            item.id === editingId
              ? { ...item, ...updatedPrayerTime }
              : item
          )
        );

        setSuccess("Horaires modifiés avec succès.");
      } else {
        const createdPrayerTime = await apiPost<PrayerTime>(
          "/prayer-times/",
          payload
        );

        setPrayerTimes((current) => [createdPrayerTime, ...current]);
        setSuccess("Horaires créés avec succès.");
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Erreur enregistrement des horaires :", err);
      setError(
        editingId
          ? "Impossible de modifier ces horaires."
          : "Impossible de créer ces horaires."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(prayerTime: PrayerTime) {
    setError("");
    setSuccess("");
    setUpdatingId(prayerTime.id);

    const nextIsActive = !prayerTime.is_active;

    try {
      await apiPatch(`/prayer-times/${prayerTime.id}/`, {
        is_active: nextIsActive,
      });

      setPrayerTimes((current) =>
        current.map((item) =>
          item.id === prayerTime.id
            ? { ...item, is_active: nextIsActive }
            : item
        )
      );

      setSuccess(
        nextIsActive
          ? "Horaires activés avec succès."
          : "Horaires désactivés avec succès."
      );
    } catch (err) {
      console.error("Erreur modification du statut :", err);
      setError("Impossible de modifier le statut de ces horaires.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {success}
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Horaires de prière
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Gérez les horaires quotidiens, l’iqama, la Jumua et les horaires spécifiques à la mosquée.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadPrayerTimes}
            disabled={loading}
            className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
          >
            Actualiser
          </button>

          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
          >
            Ajouter des horaires
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Journées enregistrées" value={prayerTimes.length} />
        <StatCard title="Horaires actifs" value={activeCount} />
        <StatCard title="Horaires inactifs" value={inactiveCount} />
        <StatCard title="Prières quotidiennes" value={PRAYER_FIELDS.length} />
      </div>

      {showForm && (
        <form
          onSubmit={submitForm}
          className="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <h3 className="text-lg font-bold text-gray-900">
            {editingId
              ? "Modifier les horaires"
              : "Ajouter les horaires du jour"}
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <FormField
              label="Date"
              type="date"
              value={form.date}
              onChange={(value) => updateForm("date", value)}
              required
            />

            <FormField
              label="Notes"
              value={form.notes}
              onChange={(value) => updateForm("notes", value)}
              placeholder="Précisions éventuelles"
            />

            <div className="md:col-span-2">
              <h4 className="mb-3 text-sm font-bold text-gray-900">
                Horaires adhan
              </h4>

              <div className="grid gap-4 md:grid-cols-5">
                {PRAYER_FIELDS.map((prayer) => (
                  <FormField
                    key={prayer}
                    label={PRAYER_LABELS[prayer]}
                    type="time"
                    value={form[prayer]}
                    onChange={(value) => updateForm(prayer, value)}
                  />
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <h4 className="mb-3 text-sm font-bold text-gray-900">
                Horaires iqama
              </h4>

              <div className="grid gap-4 md:grid-cols-5">
                <FormField
                  label="Fajr iqama"
                  type="time"
                  value={form.fajr_iqama}
                  onChange={(value) => updateForm("fajr_iqama", value)}
                />

                <FormField
                  label="Dhuhr iqama"
                  type="time"
                  value={form.dhuhr_iqama}
                  onChange={(value) => updateForm("dhuhr_iqama", value)}
                />

                <FormField
                  label="Asr iqama"
                  type="time"
                  value={form.asr_iqama}
                  onChange={(value) => updateForm("asr_iqama", value)}
                />

                <FormField
                  label="Maghrib iqama"
                  type="time"
                  value={form.maghrib_iqama}
                  onChange={(value) => updateForm("maghrib_iqama", value)}
                />

                <FormField
                  label="Isha iqama"
                  type="time"
                  value={form.isha_iqama}
                  onChange={(value) => updateForm("isha_iqama", value)}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <h4 className="mb-3 text-sm font-bold text-gray-900">
                Jumua
              </h4>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  label="Heure de la Jumua"
                  type="time"
                  value={form.jumua_time}
                  onChange={(value) => updateForm("jumua_time", value)}
                />

                <FormField
                  label="Heure de la khutbah"
                  type="time"
                  value={form.jumua_khutbah_time}
                  onChange={(value) =>
                    updateForm("jumua_khutbah_time", value)
                  }
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setForm(EMPTY_FORM);
                setEditingId(null);
                setShowForm(false);
              }}
              className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-emerald-800 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-900 disabled:opacity-50"
            >
              {saving
                ? "Enregistrement..."
                : editingId
                  ? "Enregistrer les modifications"
                  : "Enregistrer les horaires"}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_200px]">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher par date ou note..."
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as "all" | "active" | "inactive"
            )
          }
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Actifs</option>
          <option value="inactive">Inactifs</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h3 className="font-bold text-gray-900">
            Horaires de prière
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {filteredPrayerTimes.length} journée(s)
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Chargement...
          </div>
        ) : filteredPrayerTimes.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-lg font-bold text-gray-800">
              Aucun horaire trouvé
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Ajoutez les horaires du jour ou modifiez vos filtres.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Fajr</th>
                  <th className="px-6 py-4">Dhuhr</th>
                  <th className="px-6 py-4">Asr</th>
                  <th className="px-6 py-4">Maghrib</th>
                  <th className="px-6 py-4">Isha</th>
                  <th className="px-6 py-4">Jumua</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredPrayerTimes.map((prayerTime) => {
                  const isUpdating = updatingId === prayerTime.id;

                  return (
                    <tr key={prayerTime.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {prayerTime.date}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {prayerTime.fajr || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {prayerTime.dhuhr || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {prayerTime.asr || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {prayerTime.maghrib || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {prayerTime.isha || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {prayerTime.jumua_time || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            prayerTime.is_active
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {prayerTime.is_active ? "Actif" : "Inactif"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-4">
                          <button
                            type="button"
                            onClick={() => openEditForm(prayerTime)}
                            className="font-semibold text-emerald-700 hover:underline"
                          >
                            Modifier
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleStatus(prayerTime)}
                            disabled={isUpdating}
                            className={`font-semibold hover:underline disabled:opacity-50 ${
                              prayerTime.is_active
                                ? "text-red-600"
                                : "text-emerald-700"
                            }`}
                          >
                            {isUpdating
                              ? "Modification..."
                              : prayerTime.is_active
                                ? "Désactiver"
                                : "Activer"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function FormField({
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
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
      />
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-sm font-medium text-gray-500">{title}</p>

      <p className="mt-3 text-3xl font-extrabold text-gray-950">{value}</p>
    </div>
  );
}