import { Model, Schema, model } from "mongoose";
import { AccountConfigurationTypes } from "../types";
import RecurrentExpense, { RecurrentExpenseFields } from "./RecurrentExpense";

interface IAccountConfigurationModel
  extends Model<AccountConfigurationTypes.AccountConfiguration> {}

const schema = new Schema<AccountConfigurationTypes.AccountConfiguration>({
  accountId: { type: String, index: true, required: true },
  budget: {
    totalBudget: { type: Number, index: true, required: true },
    categoriesBudget: { type: Schema.Types.Mixed, required: false },
  },

  toggles: {
    type: {
      enableAutoExpenseAdd: { type: Boolean, index: true, required: false },
    },
    index: true,
    required: false,
  },
});

const AccountConfiguration: IAccountConfigurationModel = model<
  AccountConfigurationTypes.AccountConfiguration,
  IAccountConfigurationModel
>("AccountConfiguration", schema);

export default AccountConfiguration;
