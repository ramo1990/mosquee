"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList, apiPatch, apiDelete } from "@/lib/api";

type NotificationType =
  | "info"
  | "success"
  | "warning"
  | "error";

type AppNotification = {
  id: number;
  title: string;
  message: string;
  notification_type: NotificationType;
  is_read: boolean;
  created_at: string;
};

export default function NotificationsManagement() {
  const [notifications, setNotifications] = useState<
    AppNotification[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<
    "all" | NotificationType
  >("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "unread" | "read"
  >("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<AppNotification[]>(
        "/notifications/"
      );

      setNotifications(data);
    } catch (err) {
      console.error(
        "Erreur chargement des notifications :",
        err
      );
      setNotifications([]);
      setError(
        "Impossible de charger les notifications pour le moment."
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
        const data = await apiGetList<AppNotification[]>(
          "/notifications/"
        );

        if (!ignore) {
          setNotifications(data);
        }
      } catch (err) {
        console.error(
          "Erreur chargement des notifications :",
          err
        );

        if (!ignore) {
          setNotifications([]);
          setError(
            "Impossible de charger les notifications pour le moment."
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

  const filteredNotifications = useMemo(() => {
    const query = search.toLowerCase().trim();

    return notifications
      .filter((notification) => {
        const matchesSearch =
          !query ||
          [
            notification.title,
            notification.message,
          ].some((value) => value?.toLowerCase().includes(query));

        const matchesType =
          typeFilter === "all" ||
          notification.notification_type === typeFilter;

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "unread" && !notification.is_read) ||
          (statusFilter === "read" && notification.is_read);

        return matchesSearch && matchesType && matchesStatus;
      })
      .sort((a, b) =>
        b.created_at.localeCompare(a.created_at)
      );
  }, [notifications, search, typeFilter, statusFilter]);

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  const readCount = notifications.length - unreadCount;

  async function markAsRead(notification: AppNotification) {
    if (notification.is_read) {
      return;
    }

    setError("");
    setSuccess("");
    setUpdatingId(notification.id);

    try {
      await apiPatch(
        `/notifications/${notification.id}/`,
        {
          is_read: true,
        }
      );

      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? { ...item, is_read: true }
            : item
        )
      );

      setSuccess("Notification marquée comme lue.");
    } catch (err) {
      console.error(
        "Erreur marquage de la notification :",
        err
      );
      setError(
        "Impossible de marquer cette notification comme lue."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function markAllAsRead() {
    setError("");
    setSuccess("");

    const unreadNotifications = notifications.filter(
      (notification) => !notification.is_read
    );

    if (unreadNotifications.length === 0) {
      setSuccess("Toutes les notifications sont déjà lues.");
      return;
    }

    try {
      await Promise.all(
        unreadNotifications.map((notification) =>
          apiPatch(`/notifications/${notification.id}/`, {
            is_read: true,
          })
        )
      );

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );

      setSuccess(
        "Toutes les notifications ont été marquées comme lues."
      );
    } catch (err) {
      console.error(
        "Erreur marquage global des notifications :",
        err
      );
      setError(
        "Impossible de marquer toutes les notifications comme lues."
      );
    }
  }

  async function deleteNotification(
    notification: AppNotification
  ) {
    setError("");
    setSuccess("");
    setDeletingId(notification.id);

    try {
      await apiDelete(
        `/notifications/${notification.id}/`
      );

      setNotifications((current) =>
        current.filter(
          (item) => item.id !== notification.id
        )
      );

      setSuccess("Notification supprimée avec succès.");
    } catch (err) {
      console.error(
        "Erreur suppression de la notification :",
        err
      );
      setError(
        "Impossible de supprimer cette notification."
      );
    } finally {
      setDeletingId(null);
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
            Notifications
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Consultez et gérez les alertes et messages importants de l’application.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadNotifications}
            disabled={loading}
            className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
          >
            Actualiser
          </button>

          <button
            type="button"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900 disabled:opacity-50"
          >
            Tout marquer comme lu
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Total notifications"
          value={notifications.length}
        />

        <StatCard title="Non lues" value={unreadCount} />

        <StatCard title="Lues" value={readCount} />
      </div>

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[1fr_180px_180px]">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher une notification..."
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
        />

        <select
          value={typeFilter}
          onChange={(event) =>
            setTypeFilter(
              event.target.value as
                | "all"
                | NotificationType
            )
          }
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Tous les types</option>
          <option value="info">Information</option>
          <option value="success">Succès</option>
          <option value="warning">Avertissement</option>
          <option value="error">Erreur</option>
        </select>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as
                | "all"
                | "unread"
                | "read"
            )
          }
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          <option value="all">Tous les statuts</option>
          <option value="unread">Non lues</option>
          <option value="read">Lues</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h3 className="font-bold text-gray-900">
            Liste des notifications
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {filteredNotifications.length} notification(s)
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Chargement...
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-lg font-bold text-gray-800">
              Aucune notification trouvée
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Vous êtes à jour ou modifiez vos filtres.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => {
              const isUpdating =
                updatingId === notification.id;

              const isDeleting =
                deletingId === notification.id;

              return (
                <div
                  key={notification.id}
                  className={`p-5 transition ${
                    notification.is_read
                      ? "bg-white hover:bg-gray-50"
                      : "bg-emerald-50/40 hover:bg-emerald-50"
                  }`}
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            notification.notification_type ===
                            "success"
                              ? "bg-emerald-100 text-emerald-800"
                              : notification.notification_type ===
                                  "warning"
                                ? "bg-amber-100 text-amber-800"
                                : notification.notification_type ===
                                    "error"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {getNotificationLabel(
                            notification.notification_type
                          )}
                        </span>

                        {!notification.is_read && (
                          <span className="rounded-full bg-emerald-800 px-3 py-1 text-xs font-bold text-white">
                            Non lue
                          </span>
                        )}
                      </div>

                      <h4
                        className={`mt-3 font-bold ${
                          notification.is_read
                            ? "text-gray-800"
                            : "text-gray-950"
                        }`}
                      >
                        {notification.title}
                      </h4>

                      <p className="mt-1 text-sm text-gray-600">
                        {notification.message}
                      </p>

                      <p className="mt-2 text-xs text-gray-500">
                        {new Date(
                          notification.created_at
                        ).toLocaleString("fr-FR")}
                      </p>
                    </div>

                    <div className="flex gap-4">
                      {!notification.is_read && (
                        <button
                          type="button"
                          onClick={() =>
                            markAsRead(notification)
                          }
                          disabled={isUpdating}
                          className="font-semibold text-emerald-700 hover:underline disabled:opacity-50"
                        >
                          {isUpdating
                            ? "Modification..."
                            : "Marquer comme lue"}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          deleteNotification(notification)
                        }
                        disabled={isDeleting}
                        className="font-semibold text-red-600 hover:underline disabled:opacity-50"
                      >
                        {isDeleting
                          ? "Suppression..."
                          : "Supprimer"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function getNotificationLabel(
  type: NotificationType
): string {
  switch (type) {
    case "success":
      return "Succès";
    case "warning":
      return "Avertissement";
    case "error":
      return "Erreur";
    default:
      return "Information";
  }
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