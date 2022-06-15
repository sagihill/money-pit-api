import { Model, Schema, model } from "mongoose";
import { AccountTypes } from "../types";
import BaseEntitySchema from "./Base";

interface IAccountUserPairModel extends Model<AccountTypes.AccountUserPair> {}

const schema = new Schema<AccountTypes.AccountUserPair>(
  {
    id: { type: String, index: true, required: true },
    accountId: { type: String, index: true, required: true },
    userId: { type: String, index: true, required: true },
    ...BaseEntitySchema,
  },
  { timestamps: true, collection: "AccountUserPair" }
);

schema.index(
  { accountId: 1, userId: 1 },
  { name: "account_user_index", unique: true }
);

const AccountUserPair: IAccountUserPairModel = model<
  AccountTypes.AccountUserPair,
  IAccountUserPairModel
>("AccountUserPair", schema);

export default AccountUserPair;
