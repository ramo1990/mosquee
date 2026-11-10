import { useCallback, useEffect, useMemo, useState } from "react";
import {
  apiGetList,
  apiPatch,
  apiDelete,
} from "@/lib/api";

import {
  AppNotification,
  NotificationType,
  NotificationTypeFilter,
  NotificationStatusFilter,
} from "./types";

export function useNotifications() {
  const [notifications, setNotifications] = useState<
    AppNotification[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] =
    useState<NotificationTypeFilter>("all");

  const [statusFilter, setStatusFilter] =
    useState<NotificationStatusFilter>("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Chargement des notifications
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

  // Chargement initial
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

  // Recherche et filtres
  const filteredNotifications = useMemo(() => {
    const query = search.toLowerCase().trim();

    return notifications
      .filter((notification) => {
        const matchesSearch =
          !query ||
          [
            notification.title,
            notification.message,
          ].some((value) =>
            value?.toLowerCase().includes(query)
          );

        const matchesType =
          typeFilter === "all" ||
          notification.notification_type === typeFilter;

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "unread" &&
            !notification.is_read) ||
          (statusFilter === "read" &&
            notification.is_read);

        return (
          matchesSearch &&
          matchesType &&
          matchesStatus
        );
      })
      .sort((a, b) =>
        b.created_at.localeCompare(a.created_at)
      );
  }, [
    notifications,
    search,
    typeFilter,
    statusFilter,
  ]);

  // Statistiques
  const unreadCount = useMemo(
    () =>
      notifications.filter(
        (notification) => !notification.is_read
      ).length,
    [notifications]
  );

  const readCount = notifications.length - unreadCount;

  // Marquer une notification comme lue
  async function markAsRead(
    notification: AppNotification
  ) {
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

  // Tout marquer comme lu
  async function markAllAsRead() {
    setError("");
    setSuccess("");

    const unreadNotifications = notifications.filter(
      (notification) => !notification.is_read
    );

    if (unreadNotifications.length === 0) {
      setSuccess(
        "Toutes les notifications sont déjà lues."
      );
      return;
    }

    try {
      await Promise.all(
        unreadNotifications.map((notification) =>
          apiPatch(
            `/notifications/${notification.id}/`,
            {
              is_read: true,
            }
          )
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

  // Supprimer une notification
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

      setSuccess(
        "Notification supprimée avec succès."
      );
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

  return {
    notifications,
    filteredNotifications,

    loading,
    updatingId,
    deletingId,

    search,
    setSearch,

    typeFilter,
    setTypeFilter,

    statusFilter,
    setStatusFilter,

    unreadCount,
    readCount,

    error,
    success,

    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}