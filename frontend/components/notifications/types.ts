export type NotificationType =
  | "info"
  | "success"
  | "warning"
  | "error";

export type AppNotification = {
  id: number;
  title: string;
  message: string;
  notification_type: NotificationType;
  is_read: boolean;
  created_at: string;
};

export type NotificationTypeFilter =
  | "all"
  | NotificationType;

export type NotificationStatusFilter =
  | "all"
  | "unread"
  | "read";