import {
  AppNotification,
  NotificationType,
} from "./types";

type Props = {
  notifications: AppNotification[];
  loading: boolean;
  updatingId: number | null;
  deletingId: number | null;
  onMarkAsRead: (notification: AppNotification) => void;
  onDelete: (notification: AppNotification) => void;
};

export default function NotificationsList({
  notifications,
  loading,
  updatingId,
  deletingId,
  onMarkAsRead,
  onDelete,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">

      {/* En-tête */}
      <div className="border-b border-gray-200 p-5">
        <h3 className="font-bold text-gray-900">
          Liste des notifications
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {notifications.length} notification(s)
        </p>
      </div>

      {/* Chargement */}
      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500">
          Chargement...
        </div>
      ) : notifications.length === 0 ? (
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
          {notifications.map((notification) => {
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

                  {/* Informations */}
                  <div className="flex-1">

                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${getNotificationColor(
                          notification.notification_type
                        )}`}
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

                  {/* Actions */}
                  <div className="flex gap-4">

                    {!notification.is_read && (
                      <button
                        type="button"
                        onClick={() =>
                          onMarkAsRead(notification)
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
                        onDelete(notification)
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
  );
}

// Libellé du type
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

// Couleur du badge
function getNotificationColor(
  type: NotificationType
): string {
  switch (type) {
    case "success":
      return "bg-emerald-100 text-emerald-800";

    case "warning":
      return "bg-amber-100 text-amber-800";

    case "error":
      return "bg-red-100 text-red-700";

    default:
      return "bg-blue-100 text-blue-800";
  }
}