import { Model, Schema, model } from "mongoose";
import { RecurrentExpenseTypes } from "../types";
import BaseEntitySchema from "./Base";

interface IReccurentExpenseModel
  extends Model<RecurrentExpenseTypes.RecurrentExpense> {}

export const RecurrentExpenseFields = {
  id: { type: String, index: true, required: true, unique: true },
  accountId: { type: String, index: true, required: true },
  name: { type: String, index: true, required: true },
  category: { type: String, index: true, required: true },
  amount: { type: Number, index: true, required: true },
  currency: { type: String, index: true, required: true },
  dueDay: { type: Number, index: true, required: true },
  description: { type: String, index: true, required: false },
  recurrence: { type: String, index: true, required: true },
  type: { type: String, index: true, required: true },
  ...BaseEntitySchema,
};

const schema = new Schema<RecurrentExpenseTypes.RecurrentExpense>(
  RecurrentExpenseFields,
  { timestamps: true, collection: "RecurrentExpense" }
);

const RecurrentExpense: IReccurentExpenseModel = model<
  RecurrentExpenseTypes.RecurrentExpense,
  IReccurentExpenseModel
>("RecurrentExpense", schema);

export default RecurrentExpense;
