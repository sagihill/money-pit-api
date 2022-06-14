import { Model, Schema, model } from "mongoose";
import { CreditAccountTypes } from "../types";
import BaseEntitySchema from "./Base";

interface ICreditAccountModel extends Model<CreditAccountTypes.CreditAccount> {}

const schema = new Schema<CreditAccountTypes.CreditAccount>({
  id: { type: String, index: true, required: true },
  accountId: { type: String, index: true, required: true },
  creditProvider: { type: String, index: true, required: true },
  credentials: {
    username: { type: String, index: true, required: true },
    password: { type: String, index: true, required: true },
  },
  ...BaseEntitySchema,
});

const CreditAccount: ICreditAccountModel = model<
  CreditAccountTypes.CreditAccount,
  ICreditAccountModel
>("CreditAccount", schema);

export default CreditAccount;
