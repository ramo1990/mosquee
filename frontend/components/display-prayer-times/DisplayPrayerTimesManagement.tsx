"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

type DisplayPrayerTime = {
  id: number;
  date: string;
  screen_group?: string;
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
  is_published: boolean;
};

type DisplayPrayerTimeForm = {
  date: string;
  screen_group: string;
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

const EMPTY_FORM: DisplayPrayerTimeForm = {
  date: new Date().toISOString().slice(0, 10),
  screen_group: "",
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

export default function DisplayPrayerTimesManagement() {
  const [prayerTimes, setPrayerTimes] = useState<
    DisplayPrayerTime[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<DisplayPrayerTimeForm>(
    EMPTY_FORM
  );

  const loadPrayerTimes = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<DisplayPrayerTime[]>(
        "/display-prayer-times/"
      );

      setPrayerTimes(data);
    } catch (err) {
      console.error(
        "Erreur chargement des horaires affichés :",
        err
      );
      setPrayerTimes([]);
      setError(
        "Impossible de charger les horaires affichés pour le moment."
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
        const data = await apiGetList<DisplayPrayerTime[]>(
          "/display-prayer-times/"
        );

        if (!ignore) {
          setPrayerTimes(data);
        }
      } catch (err) {
        console.error(
          "Erreur chargement des horaires affichés :",
          err
        );

        if (!ignore) {
          setPrayerTimes([]);
          setError(
            "Impossible de charger les horaires affichés pour le moment."
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

  const availableGroups = useMemo(() => {
    const groups = new Set<string>();

    prayerTimes.forEach((prayerTime) => {
      if (prayerTime.screen_group) {
        groups.add(prayerTime.screen_group);
      }
    });

    return Array.from(groups).sort();
  }, [prayerTimes]);

  const filteredPrayerTimes = useMemo(() => {
    const query = search.toLowerCase().trim();

    return prayerTimes
      .filter((prayerTime) => {
        const matchesSearch =
          !query ||
          [
            prayerTime.date,
            prayerTime.screen_group,
            prayerTime.notes,
          ].some((value) => value?.toLowerCase().includes(query));

        const matchesGroup =
          groupFilter === "all" ||
          prayerTime.screen_group === groupFilter;

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "published" && prayerTime.is_published) ||
          (statusFilter === "draft" && !prayerTime.is_published);

        return matchesSearch && matchesGroup && matchesStatus;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [prayerTimes, search, groupFilter, statusFilter]);

  const publishedCount = prayerTimes.filter(
    (prayerTime) => prayerTime.is_published
  ).length;

  const draftCount = prayerTimes.length - publishedCount;

  function updateForm(
    field: keyof DisplayPrayerTimeForm,
    value: string
  ) {
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

  function openEditForm(prayerTime: DisplayPrayerTime) {
    setForm({
      date: prayerTime.date,
      screen_group: prayerTime.screen_group ?? "",
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

  async function submitForm(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const payload = {
      date: form.date,
      screen_group: form.screen_group.trim() || undefined,
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
        const updatedPrayerTime = await apiPatch<DisplayPrayerTime>(
          `/display-prayer-times/${editingId}/`,
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
        const createdPrayerTime = await apiPost<DisplayPrayerTime>(
          "/display-prayer-times/",
          payload
        );

        setPrayerTimes((current) => [
          createdPrayerTime,
          ...current,
        ]);
        setSuccess("Horaires créés avec succès.");
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error(
        "Erreur enregistrement des horaires :",
        err
      );
      setError(
        editingId
          ? "Impossible de modifier ces horaires."
          : "Impossible de créer ces horaires."
      );
    } finally {
      setSaving(false);
    }
  }

  async function togglePublication(
    prayerTime: DisplayPrayerTime
  ) {
    setError("");
    setSuccess("");
    setUpdatingId(prayerTime.id);

    const nextIsPublished = !prayerTime.is_published;

    try {
      await apiPatch(
        `/display-prayer-times/${prayerTime.id}/`,
        {
          is_published: nextIsPublished,
        }
      );

      setPrayerTimes((current) =>
        current.map((item) =>
          item.id === prayerTime.id
            ? { ...item, is_published: nextIsPublished }
            : item
        )
      );

      setSuccess(
        nextIsPublished
          ? "Horaires publiés avec succès."
          : "Horaires retirés de la publication."
      );
    } catch (err) {
      console.error(
        "Erreur modification de la publication :",
        err
      );
      setError(
        "Impossible de modifier la publication de ces horaires."
      );
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
            Horaires de prière affichés
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Gérez les horaires de prière et l’iqama affichés sur les écrans.
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
        <StatCard title="Journées" value={prayerTimes.length} />
        <StatCard title="Publiées" value={publishedCount} />
        <StatCard title="Brouillons" value={draftCount} />
        <StatCard
          title="Groupes d’écrans"
          value={availableGroups.length}
        />
      </div>

      {showForm && (
        <form
          onSubmit={submitForm}
          className="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <h3 className="text-lg font-bold text-gray-900">
            {editingId
              ? "Modifier les horaires affichés"
              : "Ajouter les horaires affichés"}
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
              label="Groupe d’écrans"
              value={form.screen_group}
              onChange={(value) =>
                updateForm("screen_group", value)
              }
              placeholder="Exemple : Accueil, Salle de prière"
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
                  onChange={(value) =>
                    updateForm("fajr_iqama", value)
                  }
                />

                <FormField
                  label="Dhuhr iqama"
                  type="time"
                  value={form.dhuhr_iqama}
                  onChange={(value) =>
                    updateForm("dhuhr_iqama", value)
                  }
                />

                <FormField
                  label="Asr iqama"
                  type="time"
                  value={form.asr_iqama}
                  onChange={(value) =>
                    updateForm("asr_iqama", value)
                  }
                />

                <FormField
                  label="Maghrib iqama"
                  type="time"
                  value={form.maghrib_iqama}
                  onChange={(value) =>
                    updateForm("maghrib_iqama", value)
                  }
                />

                <FormField
                  label="Isha iqama"
                  type="time"
                  value={form.isha_iqama}
                  onChange={(value) =>
                    updateForm("isha_iqama", value)
                  }
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
                  onChange={(value) =>
                    updateForm("jumua_time", value)
                  }
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

            <div className="md:col-span-2">
              <FormField
                label="Notes"
                value={form.notes}
                onChange={(value) => updateForm("notes", value)}
                placeholder="Précisions affichées sur les écrans"
              />
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

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_200px_180px]">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher par date, groupe ou note..."
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
        />

        <select
          value={groupFilter}
          onChange={(event) => setGroupFilter(event.target.value)}
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Tous les groupes</option>

          {availableGroups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as "all" | "published" | "draft"
            )
          }
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Tous les statuts</option>
          <option value="published">Publiés</option>
          <option value="draft">Brouillons</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h3 className="font-bold text-gray-900">
            Horaires affichés
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
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Groupe</th>
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
                  const isUpdating =
                    updatingId === prayerTime.id;

                  return (
                    <tr
                      key={prayerTime.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {prayerTime.date}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {prayerTime.screen_group || "—"}
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
                            prayerTime.is_published
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {prayerTime.is_published
                            ? "Publié"
                            : "Brouillon"}
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
                            onClick={() =>
                              togglePublication(prayerTime)
                            }
                            disabled={isUpdating}
                            className={`font-semibold hover:underline disabled:opacity-50 ${
                              prayerTime.is_published
                                ? "text-red-600"
                                : "text-emerald-700"
                            }`}
                          >
                            {isUpdating
                              ? "Modification..."
                              : prayerTime.is_published
                                ? "Dépublier"
                                : "Publier"}
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