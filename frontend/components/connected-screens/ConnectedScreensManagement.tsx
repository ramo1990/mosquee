"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPatch } from "@/lib/api";

type ConnectionStatus = "connected" | "disconnected" | "maintenance";

type ConnectedScreen = {
  id: number;
  name: string;
  location?: string;
  group?: string;
  ip_address?: string;
  mac_address?: string;
  browser?: string;
  resolution?: string;
  connection_status: ConnectionStatus;
  last_seen?: string;
  is_active: boolean;
};

type ScreenAction = {
  screenId: number;
  action: "restart" | "maintenance" | "activate";
};

const STATUS_LABELS: Record<ConnectionStatus, string> = {
  connected: "Connecté",
  disconnected: "Déconnecté",
  maintenance: "Maintenance",
};

const STATUS_COLORS: Record<ConnectionStatus, string> = {
  connected: "bg-emerald-100 text-emerald-800",
  disconnected: "bg-red-100 text-red-700",
  maintenance: "bg-amber-100 text-amber-800",
};

export default function ConnectedScreensManagement() {
  const [screens, setScreens] = useState<ConnectedScreen[]>([]);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | ConnectionStatus
  >("all");
  const [groupFilter, setGroupFilter] = useState("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadScreens = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<ConnectedScreen[]>(
        "/connected-screens/"
      );

      setScreens(data);
    } catch (err) {
      console.error(
        "Erreur chargement des écrans connectés :",
        err
      );
      setScreens([]);
      setError(
        "Impossible de charger les écrans connectés pour le moment."
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
        const data = await apiGetList<ConnectedScreen[]>(
          "/connected-screens/"
        );

        if (!ignore) {
          setScreens(data);
        }
      } catch (err) {
        console.error(
          "Erreur chargement des écrans connectés :",
          err
        );

        if (!ignore) {
          setScreens([]);
          setError(
            "Impossible de charger les écrans connectés pour le moment."
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
          screen.ip_address,
          screen.mac_address,
          screen.browser,
        ].some((value) => value?.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "all" ||
        screen.connection_status === statusFilter;

      const matchesGroup =
        groupFilter === "all" || screen.group === groupFilter;

      return matchesSearch && matchesStatus && matchesGroup;
    });
  }, [screens, search, statusFilter, groupFilter]);

  const connectedCount = screens.filter(
    (screen) => screen.connection_status === "connected"
  ).length;

  const disconnectedCount = screens.filter(
    (screen) => screen.connection_status === "disconnected"
  ).length;

  const maintenanceCount = screens.filter(
    (screen) => screen.connection_status === "maintenance"
  ).length;

  async function handleScreenAction({
    screenId,
    action,
  }: ScreenAction) {
    setError("");
    setSuccess("");
    setUpdatingId(screenId);

    const payload =
      action === "restart"
        ? { action: "restart" }
        : action === "maintenance"
          ? { connection_status: "maintenance" }
          : { connection_status: "connected", is_active: true };

    try {
      const updatedScreen = await apiPatch<ConnectedScreen>(
        `/connected-screens/${screenId}/`,
        payload
      );

      setScreens((current) =>
        current.map((screen) =>
          screen.id === screenId
            ? { ...screen, ...updatedScreen }
            : screen
        )
      );

      setSuccess(
        action === "restart"
          ? "Redémarrage demandé avec succès."
          : action === "maintenance"
            ? "Écran mis en maintenance."
            : "Écran activé avec succès."
      );
    } catch (err) {
      console.error("Erreur action sur l'écran :", err);
      setError("Impossible d'exécuter cette action sur l'écran.");
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
            Écrans connectés
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Consultez l’état, la connexion et les informations des écrans installés.
          </p>
        </div>

        <button
          type="button"
          onClick={loadScreens}
          disabled={loading}
          className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
        >
          Actualiser
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total écrans" value={screens.length} />
        <StatCard title="Connectés" value={connectedCount} />
        <StatCard title="Déconnectés" value={disconnectedCount} />
        <StatCard title="En maintenance" value={maintenanceCount} />
      </div>

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_180px_200px]">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher par nom, IP, MAC ou emplacement..."
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as "all" | ConnectionStatus
            )
          }
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Tous les statuts</option>

          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
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
            Écrans installés
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
              Modifiez vos filtres ou vérifiez la connexion des écrans.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Écran</th>
                  <th className="px-6 py-4">Emplacement</th>
                  <th className="px-6 py-4">Groupe</th>
                  <th className="px-6 py-4">Adresse IP</th>
                  <th className="px-6 py-4">Adresse MAC</th>
                  <th className="px-6 py-4">Résolution</th>
                  <th className="px-6 py-4">Dernière activité</th>
                  <th className="px-6 py-4">Connexion</th>
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
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">
                          {screen.name}
                        </div>

                        <div className="mt-1 text-xs text-gray-500">
                          {screen.browser || "Navigateur inconnu"}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {screen.location || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {screen.group || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {screen.ip_address || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {screen.mac_address || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {screen.resolution || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {screen.last_seen || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLORS[screen.connection_status]}`}
                        >
                          {STATUS_LABELS[screen.connection_status]}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-4">
                          <button
                            type="button"
                            onClick={() =>
                              handleScreenAction({
                                screenId: screen.id,
                                action: "restart",
                              })
                            }
                            disabled={isUpdating}
                            className="font-semibold text-blue-700 hover:underline disabled:opacity-50"
                          >
                            {isUpdating
                              ? "Traitement..."
                              : "Redémarrer"}
                          </button>

                          {screen.connection_status !==
                            "maintenance" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleScreenAction({
                                  screenId: screen.id,
                                  action: "maintenance",
                                })
                              }
                              disabled={isUpdating}
                              className="font-semibold text-amber-700 hover:underline disabled:opacity-50"
                            >
                              Maintenance
                            </button>
                          )}

                          {screen.connection_status ===
                            "disconnected" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleScreenAction({
                                  screenId: screen.id,
                                  action: "activate",
                                })
                              }
                              disabled={isUpdating}
                              className="font-semibold text-emerald-700 hover:underline disabled:opacity-50"
                            >
                              Activer
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