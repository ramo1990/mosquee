"use client";

import { useNotifications } from "./useNotifications";

import NotificationsStats from "./NotificationsStats";
import NotificationsFilters from "./NotificationsFilters";
import NotificationsList from "./NotificationsList";

export default function NotificationsManagement() {
  const {
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
  } = useNotifications();

  return (
    <div className="space-y-6">

      {/* Message d'erreur */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Message de succès */}
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {success}
        </div>
      )}

      {/* En-tête */}
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

      {/* Statistiques */}
      <NotificationsStats
        total={notifications.length}
        unread={unreadCount}
        read={readCount}
      />

      {/* Recherche et filtres */}
      <NotificationsFilters
        search={search}
        setSearch={setSearch}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Liste */}
      <NotificationsList
        notifications={filteredNotifications}
        loading={loading}
        updatingId={updatingId}
        deletingId={deletingId}
        onMarkAsRead={markAsRead}
        onDelete={deleteNotification}
      />

    </div>
  );
}