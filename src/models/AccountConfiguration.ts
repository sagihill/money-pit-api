import { Model, Schema, model } from "mongoose";
import { AccountConfigurationTypes } from "../types";
import RecurrentExpense, { RecurrentExpenseFields } from "./RecurrentExpense";

interface IAccountConfigurationModel
  extends Model<AccountConfigurationTypes.AccountConfiguration> {}

const schema = new Schema<AccountConfigurationTypes.AccountConfiguration>({
  accountId: { type: String, index: true, required: true },
  incomes: {
    type: [
      {
        id: { type: String, index: true, required: true },
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
        id: { type: String, index: true, required: true },
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
  toggles: {
    type: {
      enableAutoExpenseAdd: { type: Boolean, index: true, required: false },
    },
    index: true,
    required: false,
  },
  recurrentExpenses: {
    type: [RecurrentExpenseFields],
    index: true,
    required: false,
  },
});

const AccountConfiguration: IAccountConfigurationModel = model<
  AccountConfigurationTypes.AccountConfiguration,
  IAccountConfigurationModel
>("AccountConfiguration", schema);

export default AccountConfiguration;
