import { ServicesProvider } from "../../services-provider";

export default async () => {
  const SP = ServicesProvider.get();
  const config = await SP.Config();
  const configs = [
    {
      key: "SOME_KEY",
      value: "SOME_VALUE",
    },
    {
      key: "SOME_ANOTHER_KEY",
      value: "SOME_VALUE",
    },
  ];

  await config.addMany(configs);
};
