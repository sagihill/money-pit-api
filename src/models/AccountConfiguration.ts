import { Model, Schema, model } from "mongoose";
import { AccountConfigurationTypes } from "../types";
import RecurrentExpense from "./RecurrentExpense";

interface IAccountConfigurationModel
  extends Model<AccountConfigurationTypes.AccountConfiguration> {}

const schema = new Schema<AccountConfigurationTypes.AccountConfiguration>({
  incomes: {
    type: [
      {
        amount: { type: Number, index: true, required: true },
        timestamp: { type: Date, index: true, required: false },
        currency: { type: String, index: true, required: true },
        payDay: { type: Number, index: true, required: true },
      },
    ],
    index: true,
    required: true,
  },
  budget: {
    totalBudget: { type: Number, index: true, required: true },
    categoriesBudget: { type: Schema.Types.Mixed, required: false },
  },
  creditAccounts: {
    type: [
      {
        creditProvider: { type: String, index: true, required: true },
        credentials: {
          username: { type: String, index: true, required: true },
          password: { type: String, index: true, required: true },
        },
      },
    ],
    index: true,
    required: false,
  },
  recurrentExpenses: [RecurrentExpense],
});

const AccountConfiguration: IAccountConfigurationModel = model<
  AccountConfigurationTypes.AccountConfiguration,
  IAccountConfigurationModel
>("AccountConfiguration", schema);

export default AccountConfiguration;
