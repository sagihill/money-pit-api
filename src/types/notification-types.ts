export namespace NotificationTypes {
  export interface INotificationService {
    notifyAccountStatus(accountId: string): Promise<void>;
  }
}
