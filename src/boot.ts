import { Async } from "./lib";
import { ServicesProvider } from "./services/services-provider";
const SP = ServicesProvider.get();

const boot = async () => {
  // Async.IIFE(async () => {
  //   const ES = await SP.ExpesnseSheets();
  //   const config = await SP.Config();
  //   // const params: ExpenseSheetsTypes.ExpesnseSheetsParams = {
  //   //   creditProviderWebsiteUrl: (await config.get("BANK_URL")) ?? "",
  //   //   credentials: {
  //   //     username: (await config.get("BANK_USERNAME")) ?? "",
  //   //     password: (await config.get("BANK_PASSWORD")) ?? "",
  //   //   },
  //   //   accountId: (await config.get("ACCOUNT_ID")) ?? "",
  //   // };\
  //   // await ES.run(params);
  //   // await Sync.sleep(5000);
  //   const EP = await SP.ExpesnseProcessor();
  //   await EP.run({ accountId: (await config.get("ACCOUNT_ID")) ?? "" });
  // });
  // Async.IIFE(async () => {
  //   const Task = await SP.Task();
  //   await Task.run();
  // });
  // setInterval(function () {
  //   Async.IIFE(async () => {
  //     const Config = await SP.Config();
  //     console.log(await Config.get("test"));
  //   });
  // }, 30000);
  // Async.IIFE(async () => {
  //   const config = await SP.Config();
  //   const EP = await SP.ExpesnseProcessor();
  //   await EP.processRecurrentExpenses({
  //     accountId: (await config.get("ACCOUNT_ID")) ?? "",
  //   });
  // });
};

export default boot;
