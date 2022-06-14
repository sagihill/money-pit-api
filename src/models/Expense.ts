import { Model, Schema, model } from "mongoose";
import { AccountingTypes } from "../types";
import BaseEntitySchema from "./Base";

interface IExpenseModel extends Model<AccountingTypes.Expense> {}

const schema = new Schema<AccountingTypes.Expense>(
  {
    id: { type: String, index: true, required: true, unique: true },
    accountId: { type: String, index: true, required: true },
    name: { type: String, index: true, required: true },
    category: { type: String, index: true, required: true },
    timestamp: { type: Date, index: true, required: true },
    chargeDate: { type: Date, index: true, required: false },
    amount: { type: Number, index: true, required: true },
    currency: { type: String, index: true, required: true },
    description: { type: String, index: true, required: false },
    type: { type: String, index: true, required: true },
    ...BaseEntitySchema,
  },
  { timestamps: true }
);

const Expense: IExpenseModel = model<AccountingTypes.Expense, IExpenseModel>(
  "Expense",
  schema
);

export default Expense;
