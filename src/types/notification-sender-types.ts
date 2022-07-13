import * as NodeMailer from "nodemailer";

export namespace NotificationSenderTypes {
  export interface INotificationSender {
    sendEmail(options: NodeMailer.SendMailOptions): Promise<void>;
  }
}
