import { ServicesProvider } from "../../services-provider";

export default async () => {
  const SP = ServicesProvider.get();
  const config = await SP.Config();
  const configs = [
    {
      key: "EXPENSE_CATEGORY_NAME_MAP",
      value:
        '{"ג\'ונגל":"mia","מרכז פירות וירקות":"groceries","כללית":"medical","סאבטרה":"fitness","שופרסל":"groceries","אקוביל":"home","רון ג\'מילי":"beauty_and_grooming","APPLE.COM/BILL":"internet_subscriptions","BUBBLE DAN":"transportation","מ.תחבורה רב- פס":"transportation"},',
    },
    {
      key: "EXPENSE_CATEGORY_CATEGORY_MAP",
      value:
        '{"ביטוח":"insurance","מזון וצריכה":"consumption","שרותי תקשורת":"communication_services","מחשבים, תוכנות וחשמל":"other","דלק חשמל וגז":"fuel_gas_and_electricity","עירייה וממשלה":"goverment_and_municipality","כלבו":"other","שונות":"other","רפואה וקוסמטיקה":"medical"},',
    },
    {
      key: "EXPENSE_NAME_FORMAT_CONFIG",
      value:
        '{"ALEM":"mela","העברה ב BIT":"Bit - העברה ב","PAYBOX":"Paybox - העברה ב","בריאות כללית":"כללית","חברת פרטנר תקשורת בע\\"מ (ה":"פרטנר"},',
    },
    {
      key: "SKIP_ALLREADY_PROCESSED_SHEETS",
      value: "true",
    },
    {
      key: "ADD_NEW_EXPENSE_TASK_CRON_INTERVAL",
      value: "*/30 * * * *",
    },
    {
      key: "ADD_NEW_EXPENSE_TASK_IS_ENABLED",
      value: "true",
    },
    {
      key: "CREDIT_PROVIDERS_URL_MAP",
      value: '{"max":"https://www.max.co.il/homepage/welcome"},',
    },
    {
      key: "ADD_MONTHLY_RECURRENT_EXPENSES_TASK_IS_ENABLED",
      value: "true",
    },
    {
      key: "ADD_MEDIANLY_RECURRENT_EXPENSES_TASK_IS_ENABLED",
      value: "false",
    },
    {
      key: "ADD_SEMESTERLY_RECURRENT_EXPENSES_TASK_IS_ENABLED",
      value: "true",
    },
    {
      key: "ADD_MEDIANLY_RECURRENT_EXPENSES_TASK_CRON_INTERVAL",
      value: "0 0 12 */6 *",
    },
    {
      key: "ADD_SEMESTERLY_RECURRENT_EXPENSES_TASK_CRON_INTERVAL",
      value: "0 0 13 */4 *",
    },
    {
      key: "REFRESH_CONFIGS_TASK_CRON_INTERVAL",
      value: "*/5 * * * *",
    },
    {
      key: "REFRESH_CONFIGS_TASK_IS_ENABLED",
      value: "true",
    },
    {
      key: "ADD_MONTHLY_RECURRENT_EXPENSES_TASK_CRON_INTERVAL",
      value: "0 0 11 */1 *",
    },
    {
      key: "LOWER_TIMESTAMP_DAY",
      value: "1",
    },
    {
      key: "UPPER_TIMESTAMP_DAY",
      value: "9",
    },
    {
      key: "LOWER_CHARGE_DAY",
      value: "10",
    },
    {
      key: "UPPER_CHARGE_DAY",
      value: "15",
    },
  ];

  await config.addMany(configs);
};
