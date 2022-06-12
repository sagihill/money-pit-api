import { Model, Schema, model } from "mongoose";
import { AccountConfigurationTypes } from "../types";

interface ICreditAccountModel
  extends Model<AccountConfigurationTypes.CreditAccount> {}

const schema = new Schema<AccountConfigurationTypes.CreditAccount>({
  id: { type: String, index: true, required: true },
  accountId: { type: String, index: true, required: true },
  creditProvider: { type: String, index: true, required: true },
  credentials: {
    username: { type: String, index: true, required: true },
    password: { type: String, index: true, required: true },
  },
});

const CreditAccount: ICreditAccountModel = model<
  AccountConfigurationTypes.CreditAccount,
  ICreditAccountModel
>("AccountConfiguration", schema);

export default CreditAccount;
