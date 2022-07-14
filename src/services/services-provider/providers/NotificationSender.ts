import * as NodeMailer from "nodemailer";
import { NotificationSenderTypes } from "../../../types";
import { ServicesProvider } from "../services-provider";
import { NotificationSender as Sender } from "../../notification-sender";

export default async function NotificationSender(
  options: any,
  SP: ServicesProvider
): Promise<NotificationSenderTypes.INotificationSender> {
  const logger = await SP.Logger();
  const config = await SP.Config();
  const mailer = NodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: await config.get("EMAIL_SMTP_USERNAME"),
      pass: await config.get("EMAIL_SMTP_PASSWORD"),
    },
    from: "MoneyPit moneypitapi@gmail.com",
  });

  return new Sender(mailer, logger);
}
