import * as NodeMailer from "nodemailer";
import { LoggerTypes, NotificationSenderTypes } from "../../types";

export class NotificationSender
  implements NotificationSenderTypes.INotificationSender
{
  constructor(
    private readonly mailer: NodeMailer.Transporter,
    private readonly logger: LoggerTypes.ILogger
  ) {}

  async sendEmail(options: NodeMailer.SendMailOptions) {
    try {
      this.logger.info("Sending email");
      await this.mailer.sendMail(options);
    } catch (error) {
      this.logger.error("Error on email sending");
    }
  }
}
