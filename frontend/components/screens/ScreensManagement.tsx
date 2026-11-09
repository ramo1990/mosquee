"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPost, apiPatch } from "@/lib/api";

type ScreenStatus = "online" | "offline" | "maintenance";

type Screen = {
  id: number;
  name: string;
  location?: string;
  group?: string;
  content?: string;
  status: ScreenStatus;
  last_seen?: string;
  is_active: boolean;
};

type ScreenForm = {
  name: string;
  location: string;
  group: string;
  content: string;
  status: ScreenStatus;
};

const EMPTY_FORM: ScreenForm = {
  name: "",
  location: "",
  group: "",
  content: "",
  status: "online",
};

const STATUS_LABELS: Record<ScreenStatus, string> = {
  online: "En ligne",
  offline: "Hors ligne",
  maintenance: "Maintenance",
};

const STATUS_COLORS: Record<ScreenStatus, string> = {
  online: "bg-emerald-100 text-emerald-800",
  offline: "bg-red-100 text-red-700",
  maintenance: "bg-amber-100 text-amber-800",
};

const STATUS_OPTIONS: ScreenStatus[] = [
  "online",
  "offline",
  "maintenance",
];

export default function ScreensManagement() {
  const [screens, setScreens] = useState<Screen[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | ScreenStatus
  >("all");
  const [groupFilter, setGroupFilter] = useState("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ScreenForm>(EMPTY_FORM);

  const loadScreens = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<Screen[]>("/screens/");

      setScreens(data);
    } catch (err) {
      console.error("Erreur chargement des écrans :", err);
      setScreens([]);
      setError(
        "Impossible de charger les écrans pour le moment."
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
        const data = await apiGetList<Screen[]>("/screens/");

        if (!ignore) {
          setScreens(data);
        }
      } catch (err) {
        console.error("Erreur chargement des écrans :", err);

        if (!ignore) {
          setScreens([]);
          setError(
            "Impossible de charger les écrans pour le moment."
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

    screens.forEach((screen) => {
      if (screen.group) {
        groups.add(screen.group);
      }
    });

    return Array.from(groups).sort();
  }, [screens]);

  const filteredScreens = useMemo(() => {
    const query = search.toLowerCase().trim();

    return screens.filter((screen) => {
      const matchesSearch =
        !query ||
        [
          screen.name,
          screen.location,
          screen.group,
          screen.content,
        ].some((value) => value?.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "all" || screen.status === statusFilter;

      const matchesGroup =
        groupFilter === "all" || screen.group === groupFilter;

      return matchesSearch && matchesStatus && matchesGroup;
    });
  }, [screens, search, statusFilter, groupFilter]);

  const onlineCount = screens.filter(
    (screen) => screen.status === "online"
  ).length;

  const offlineCount = screens.filter(
    (screen) => screen.status === "offline"
  ).length;

  const maintenanceCount = screens.filter(
    (screen) => screen.status === "maintenance"
  ).length;

  function updateForm(field: keyof ScreenForm, value: string) {
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

  function openEditForm(screen: Screen) {
    setForm({
      name: screen.name,
      location: screen.location ?? "",
      group: screen.group ?? "",
      content: screen.content ?? "",
      status: screen.status,
    });

    setEditingId(screen.id);
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
      name: form.name.trim(),
      location: form.location.trim() || undefined,
      group: form.group.trim() || undefined,
      content: form.content.trim() || undefined,
      status: form.status,
    };

    try {
      if (editingId) {
        const updatedScreen = await apiPatch<Screen>(
          `/screens/${editingId}/`,
          payload
        );

        setScreens((current) =>
          current.map((screen) =>
            screen.id === editingId
              ? { ...screen, ...updatedScreen }
              : screen
          )
        );

        setSuccess("Écran modifié avec succès.");
      } else {
        const createdScreen = await apiPost<Screen>(
          "/screens/",
          payload
        );

        setScreens((current) => [createdScreen, ...current]);
        setSuccess("Écran créé avec succès.");
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Erreur enregistrement de l'écran :", err);
      setError(
        editingId
          ? "Impossible de modifier cet écran."
          : "Impossible de créer cet écran."
      );
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(
    screen: Screen,
    status: ScreenStatus
  ) {
    setError("");
    setSuccess("");
    setUpdatingId(screen.id);

    try {
      const updatedScreen = await apiPatch<Screen>(
        `/screens/${screen.id}/`,
        {
          status,
        }
      );

      setScreens((current) =>
        current.map((item) =>
          item.id === screen.id
            ? { ...item, ...updatedScreen }
            : item
        )
      );

      setSuccess(
        `Écran marqué comme « ${STATUS_LABELS[status]} ».`
      );
    } catch (err) {
      console.error("Erreur modification du statut :", err);
      setError("Impossible de modifier le statut de cet écran.");
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
            Écrans d’affichage
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Gérez les écrans, leur statut, leurs groupes et les contenus diffusés.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadScreens}
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
            Ajouter un écran
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total écrans" value={screens.length} />
        <StatCard title="En ligne" value={onlineCount} />
        <StatCard title="Hors ligne" value={offlineCount} />
        <StatCard title="En maintenance" value={maintenanceCount} />
      </div>

      {showForm && (
        <form
          onSubmit={submitForm}
          className="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <h3 className="text-lg font-bold text-gray-900">
            {editingId
              ? "Modifier l'écran"
              : "Ajouter un nouvel écran"}
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <FormField
              label="Nom de l'écran"
              value={form.name}
              onChange={(value) => updateForm("name", value)}
              placeholder="Exemple : Écran entrée principale"
              required
            />

            <FormField
              label="Emplacement"
              value={form.location}
              onChange={(value) => updateForm("location", value)}
              placeholder="Exemple : Hall d’accueil"
            />

            <FormField
              label="Groupe"
              value={form.group}
              onChange={(value) => updateForm("group", value)}
              placeholder="Exemple : Accueil, Salle de prière, Extérieur"
            />

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Statut
              </label>

              <select
                value={form.status}
                onChange={(event) =>
                  updateForm("status", event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <FormField
                label="Contenu diffusé"
                value={form.content}
                onChange={(value) => updateForm("content", value)}
                placeholder="Exemple : Annonces, horaires de prière, événements"
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
                  : "Ajouter l'écran"}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_180px_200px]">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher un écran..."
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as "all" | ScreenStatus
            )
          }
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Tous les statuts</option>

          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>

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
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h3 className="font-bold text-gray-900">
            Liste des écrans
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {filteredScreens.length} écran(s)
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Chargement...
          </div>
        ) : filteredScreens.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-lg font-bold text-gray-800">
              Aucun écran trouvé
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Ajoutez un nouvel écran ou modifiez vos filtres.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Écran</th>
                  <th className="px-6 py-4">Emplacement</th>
                  <th className="px-6 py-4">Groupe</th>
                  <th className="px-6 py-4">Contenu</th>
                  <th className="px-6 py-4">Dernière connexion</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredScreens.map((screen) => {
                  const isUpdating = updatingId === screen.id;

                  return (
                    <tr
                      key={screen.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {screen.name}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {screen.location || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {screen.group || "—"}
                      </td>

                      <td className="px-6 py-4 max-w-md text-gray-600">
                        {screen.content || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {screen.last_seen || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLORS[screen.status]}`}
                        >
                          {STATUS_LABELS[screen.status]}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-4">
                          <button
                            type="button"
                            onClick={() => openEditForm(screen)}
                            className="font-semibold text-emerald-700 hover:underline"
                          >
                            Modifier
                          </button>

                          {screen.status !== "online" && (
                            <button
                              type="button"
                              onClick={() =>
                                changeStatus(screen, "online")
                              }
                              disabled={isUpdating}
                              className="font-semibold text-emerald-700 hover:underline disabled:opacity-50"
                            >
                              {isUpdating
                                ? "Traitement..."
                                : "Marquer en ligne"}
                            </button>
                          )}

                          {screen.status !== "maintenance" && (
                            <button
                              type="button"
                              onClick={() =>
                                changeStatus(screen, "maintenance")
                              }
                              disabled={isUpdating}
                              className="font-semibold text-amber-700 hover:underline disabled:opacity-50"
                            >
                              Maintenance
                            </button>
                          )}
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
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <input
        type="text"
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