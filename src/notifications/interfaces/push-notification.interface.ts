export enum NotificationAction {
  singleDevice = 'singleDevice',
  topic = 'topic',
  groupOfDevices = 'groupOfDevices',
}

export interface NotificationDataInterface {
  title: string;
  body: string;
}

export interface SendNotificationInterface {
  action: NotificationAction;
  dateTime: string;
  data: {
    notificationData: NotificationDataInterface;
    token?: string;
    topic?: string;
    groupOfDevices?: string[];
  };
}
