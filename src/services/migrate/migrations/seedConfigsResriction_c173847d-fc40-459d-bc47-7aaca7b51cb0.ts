import { ServicesProvider } from "../../services-provider";

export default async () => {
  const SP = ServicesProvider.get();
  const config = await SP.Config();
  const configs = [
    {
      key: "ACCOUNT_SERVICE_RESTRICTED",
      value: "true",
    },
    {
      key: "AUTH_SERVICE_RESTRICTED",
      value: "true",
    },
  ];

  await config.addMany(configs);
};
