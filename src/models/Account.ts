import { Model, Schema, model } from "mongoose";
import { AccountTypes } from "../types";

interface IAccountModel extends Model<AccountTypes.AccountDetails> {}

const schema = new Schema<AccountTypes.AccountDetails>(
  {
    id: { type: String, index: true, required: true },
    type: { type: String, index: true, required: true },
    adminUserId: { type: String, index: true, required: true },
    configuration: {
      members: { type: [String], index: true, required: true },
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
      creditAccountsConfig: {
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
    },
    deleted: { type: Boolean, index: true, required: true },
    createdAt: { type: Date, index: true, required: true },
    updatedAt: { type: Date, index: true, required: true },
  },
  { timestamps: true }
);

const Account: IAccountModel = model<
  AccountTypes.AccountDetails,
  IAccountModel
>("Account", schema);

export default Account;
