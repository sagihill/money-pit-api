import { Model, Schema, model } from "mongoose";
import { CreditAccountTypes } from "../types";

interface ICreditAccountModel extends Model<CreditAccountTypes.CreditAccount> {}

const schema = new Schema<CreditAccountTypes.CreditAccount>({
  id: { type: String, index: true, required: true },
  accountId: { type: String, index: true, required: true },
  creditProvider: { type: String, index: true, required: true },
  credentials: {
    username: { type: String, index: true, required: true },
    password: { type: String, index: true, required: true },
  },
});

const CreditAccount: ICreditAccountModel = model<
  CreditAccountTypes.CreditAccount,
  ICreditAccountModel
>("AccountConfiguration", schema);

export default CreditAccount;
