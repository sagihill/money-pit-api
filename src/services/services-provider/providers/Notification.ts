import { NotificationTypes } from "../../../types";
import { ServicesProvider } from "../services-provider";
import { NotificationService } from "../../notification";

export default async function Notification(
  options: any,
  SP: ServicesProvider
): Promise<NotificationTypes.INotificationService> {
  return new NotificationService(
    await SP.User(),
    await SP.AccountReader(),
    await SP.Accounting(),
    await SP.NotificationSender(),
    await SP.Logger()
  );
}
