import { Model, Schema, model } from "mongoose";
import { AccountingTypes } from "../types";

interface IExpenseModel extends Model<AccountingTypes.Expense> {}

const schema = new Schema<AccountingTypes.Expense>(
  {
    id: { type: String, index: true, required: true, unique: true },
    accountId: { type: String, index: true, required: true },
    category: { type: String, index: true, required: true },
    name: { type: String, index: true, required: true },
    amount: { type: Number, index: true, required: true },
    currency: { type: String, index: true, required: true },
    timestamp: { type: Date, index: true, required: true },
    deleted: { type: Boolean, index: true, required: true },
    createdAt: { type: Date, index: true, required: true },
    updatedAt: { type: Date, index: true, required: true },
  },
  { timestamps: true }
);

const Expense: IExpenseModel = model<AccountingTypes.Expense, IExpenseModel>(
  "Expense",
  schema
);

export default Expense;
