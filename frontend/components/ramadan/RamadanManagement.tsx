"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

type RamadanDay = {
  id: number;
  day_number: number;
  date: string;
  suhoor_end_time?: string;
  iftar_time?: string;
  tarawih_time?: string;
  activity?: string;
  notes?: string;
  is_published: boolean;
};

type RamadanDayForm = {
  day_number: string;
  date: string;
  suhoor_end_time: string;
  iftar_time: string;
  tarawih_time: string;
  activity: string;
  notes: string;
};

const EMPTY_FORM: RamadanDayForm = {
  day_number: "",
  date: "",
  suhoor_end_time: "",
  iftar_time: "",
  tarawih_time: "",
  activity: "",
  notes: "",
};

export default function RamadanManagement() {
  const [ramadanDays, setRamadanDays] = useState<RamadanDay[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [publicationFilter, setPublicationFilter] = useState<
    "all" | "published" | "draft"
  >("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<RamadanDayForm>(EMPTY_FORM);

  const loadRamadanDays = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<RamadanDay[]>("/ramadan-days/");

      setRamadanDays(data);
    } catch (err) {
      console.error("Erreur chargement du programme Ramadan :", err);
      setRamadanDays([]);
      setError(
        "Impossible de charger le programme Ramadan pour le moment."
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
        const data = await apiGetList<RamadanDay[]>("/ramadan-days/");

        if (!ignore) {
          setRamadanDays(data);
        }
      } catch (err) {
        console.error(
          "Erreur chargement du programme Ramadan :",
          err
        );

        if (!ignore) {
          setRamadanDays([]);
          setError(
            "Impossible de charger le programme Ramadan pour le moment."
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

  const filteredDays = useMemo(() => {
    const query = search.toLowerCase().trim();

    return ramadanDays
      .filter((day) => {
        const matchesSearch =
          !query ||
          [
            String(day.day_number),
            day.date,
            day.activity,
            day.notes,
          ].some((value) => value?.toLowerCase().includes(query));

        const matchesPublication =
          publicationFilter === "all" ||
          (publicationFilter === "published" && day.is_published) ||
          (publicationFilter === "draft" && !day.is_published);

        return matchesSearch && matchesPublication;
      })
      .sort((a, b) => a.day_number - b.day_number);
  }, [ramadanDays, search, publicationFilter]);

  const publishedCount = ramadanDays.filter(
    (day) => day.is_published
  ).length;

  const draftCount = ramadanDays.length - publishedCount;

  function updateForm(field: keyof RamadanDayForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function openCreateForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  function openEditForm(day: RamadanDay) {
    setForm({
      day_number: String(day.day_number),
      date: day.date,
      suhoor_end_time: day.suhoor_end_time ?? "",
      iftar_time: day.iftar_time ?? "",
      tarawih_time: day.tarawih_time ?? "",
      activity: day.activity ?? "",
      notes: day.notes ?? "",
    });

    setEditingId(day.id);
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
      day_number: Number(form.day_number),
      date: form.date,
      suhoor_end_time: form.suhoor_end_time || undefined,
      iftar_time: form.iftar_time || undefined,
      tarawih_time: form.tarawih_time || undefined,
      activity: form.activity.trim() || undefined,
      notes: form.notes.trim() || undefined,
    };

    try {
      if (editingId) {
        const updatedDay = await apiPatch<RamadanDay>(
          `/ramadan-days/${editingId}/`,
          payload
        );

        setRamadanDays((current) =>
          current.map((day) =>
            day.id === editingId
              ? { ...day, ...updatedDay }
              : day
          )
        );

        setSuccess("Journée modifiée avec succès.");
      } else {
        const createdDay = await apiPost<RamadanDay>(
          "/ramadan-days/",
          payload
        );

        setRamadanDays((current) => [...current, createdDay]);
        setSuccess("Journée ajoutée avec succès.");
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Erreur enregistrement de la journée :", err);
      setError(
        editingId
          ? "Impossible de modifier cette journée."
          : "Impossible d'ajouter cette journée."
      );
    } finally {
      setSaving(false);
    }
  }

  async function togglePublication(day: RamadanDay) {
    setError("");
    setSuccess("");
    setUpdatingId(day.id);

    const nextIsPublished = !day.is_published;

    try {
      await apiPatch(`/ramadan-days/${day.id}/`, {
        is_published: nextIsPublished,
      });

      setRamadanDays((current) =>
        current.map((item) =>
          item.id === day.id
            ? { ...item, is_published: nextIsPublished }
            : item
        )
      );

      setSuccess(
        nextIsPublished
          ? "Journée publiée avec succès."
          : "Journée retirée de la publication."
      );
    } catch (err) {
      console.error(
        "Erreur modification de la publication :",
        err
      );
      setError(
        "Impossible de modifier la publication de cette journée."
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
            Programme Ramadan
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Gérez les horaires du Suhoor, de l’Iftar, des Tarawih et des activités du mois de Ramadan.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadRamadanDays}
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
            Ajouter une journée
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Journées" value={ramadanDays.length} />
        <StatCard title="Publiées" value={publishedCount} />
        <StatCard title="Brouillons" value={draftCount} />
        <StatCard
          title="Activités prévues"
          value={
            ramadanDays.filter((day) => day.activity).length
          }
        />
      </div>

      {showForm && (
        <form
          onSubmit={submitForm}
          className="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <h3 className="text-lg font-bold text-gray-900">
            {editingId
              ? "Modifier la journée"
              : "Ajouter une journée de Ramadan"}
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <FormField
              label="Numéro du jour"
              type="number"
              value={form.day_number}
              onChange={(value) => updateForm("day_number", value)}
              placeholder="Exemple : 1"
              required
            />

            <FormField
              label="Date"
              type="date"
              value={form.date}
              onChange={(value) => updateForm("date", value)}
              required
            />

            <FormField
              label="Fin du Suhoor"
              type="time"
              value={form.suhoor_end_time}
              onChange={(value) =>
                updateForm("suhoor_end_time", value)
              }
            />

            <FormField
              label="Iftar"
              type="time"
              value={form.iftar_time}
              onChange={(value) => updateForm("iftar_time", value)}
            />

            <FormField
              label="Tarawih"
              type="time"
              value={form.tarawih_time}
              onChange={(value) => updateForm("tarawih_time", value)}
            />

            <FormField
              label="Activité"
              value={form.activity}
              onChange={(value) => updateForm("activity", value)}
              placeholder="Exemple : Conférence, repas communautaire, lecture du Coran"
            />

            <div className="md:col-span-2">
              <FormField
                label="Notes"
                value={form.notes}
                onChange={(value) => updateForm("notes", value)}
                placeholder="Précisions sur la journée"
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
                  : "Ajouter la journée"}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_200px]">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher par jour, date, activité ou note..."
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
        />

        <select
          value={publicationFilter}
          onChange={(event) =>
            setPublicationFilter(
              event.target.value as "all" | "published" | "draft"
            )
          }
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Tous les statuts</option>
          <option value="published">Publiées</option>
          <option value="draft">Brouillons</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h3 className="font-bold text-gray-900">
            Programme du mois de Ramadan
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {filteredDays.length} journée(s)
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Chargement...
          </div>
        ) : filteredDays.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-lg font-bold text-gray-800">
              Aucune journée trouvée
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Ajoutez les journées de Ramadan ou modifiez vos filtres.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Jour</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Fin Suhoor</th>
                  <th className="px-6 py-4">Iftar</th>
                  <th className="px-6 py-4">Tarawih</th>
                  <th className="px-6 py-4">Activité</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredDays.map((day) => {
                  const isUpdating = updatingId === day.id;

                  return (
                    <tr key={day.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-bold text-gray-900">
                        Jour {day.day_number}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {day.date}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {day.suhoor_end_time || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {day.iftar_time || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {day.tarawih_time || "—"}
                      </td>

                      <td className="px-6 py-4 max-w-xs text-gray-600">
                        {day.activity || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            day.is_published
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {day.is_published ? "Publiée" : "Brouillon"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-4">
                          <button
                            type="button"
                            onClick={() => openEditForm(day)}
                            className="font-semibold text-emerald-700 hover:underline"
                          >
                            Modifier
                          </button>

                          <button
                            type="button"
                            onClick={() => togglePublication(day)}
                            disabled={isUpdating}
                            className={`font-semibold hover:underline disabled:opacity-50 ${
                              day.is_published
                                ? "text-red-600"
                                : "text-emerald-700"
                            }`}
                          >
                            {isUpdating
                              ? "Modification..."
                              : day.is_published
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