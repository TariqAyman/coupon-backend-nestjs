export enum NotificationAction {
  all = 'all',
  singleDevice = 'singleDevice',
  topic = 'topic',
  topics = 'topics',
  groupOfDevices = 'groupOfDevices',
  groupOfUsers = 'groupOfUsers',
}

// export interface NotificationDataInterface {
//   title: string;
//   body: string;
// }

// export interface SendNotificationInterface {
//   action: NotificationAction;
//   dateTime: string;
//   data: {
//     notificationData: NotificationDataInterface;
//     token?: string;
//     topic?: string;
//     groupOfDevices?: string[];
//   };
// }
