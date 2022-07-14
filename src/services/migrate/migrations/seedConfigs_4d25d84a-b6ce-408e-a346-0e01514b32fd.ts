import { ServicesProvider } from "../../services-provider";

export default async () => {
  const SP = ServicesProvider.get();
  const config = await SP.Config();
  const configs = [
    {
      key: "SEND_ACCOUNT_SUMMERY_TASK_CRON_INTERVAL",
      value: "1 * */1 * *",
    },
    {
      key: "SEND_ACCOUNT_SUMMERY_TASK_IS_ENABLED",
      value: "true",
    },
  ];

  await config.addMany(configs);
};
