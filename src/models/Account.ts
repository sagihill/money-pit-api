import { Model, Schema, model } from "mongoose";
import { AccountTypes } from "../types";

interface IAccountModel extends Model<AccountTypes.AccountDetails> {}

const schema = new Schema<AccountTypes.AccountDetails>(
  {
    id: { type: String, index: true, required: true },
    type: { type: String, index: true, required: true },
    adminUserId: { type: String, index: true, required: true },
    members: { type: [String], index: true, required: true },
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
