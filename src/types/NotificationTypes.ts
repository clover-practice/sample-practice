// types/NotificationTypes.ts
export interface NotificationPayload {
  title?: string;
  body?: string;
  link?: string;
}

export interface NotificationData {
  type?: string;
  action1?: string;
  action2?: string;
}

export interface FirebaseMessage {
  token?: string;
  notification?: NotificationPayload;
  data?: NotificationData;
}

export interface NotificationDataNew {
  notificationId?: string;
  userId?: string;
  [key: string]: any; // allow additional dynamic fields
}
