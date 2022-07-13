import { NotificationSenderTypes } from "../../../types";
import { ServicesProvider } from "../services-provider";
import * as NodeMailer from "nodemailer";
import { NotificationSender as Sender } from "../../notification-sender";

export default async function NotificationSender(
  options: any,
  SP: ServicesProvider
): Promise<NotificationSenderTypes.INotificationSender> {
  const testAccount = await NodeMailer.createTestAccount();
  const logger = await SP.Logger();
  const mailer = NodeMailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
    from: "MoneyPit notfication@money-pit.io",
  });

  return new Sender(mailer, logger);
}
