import { Model, Schema, model } from "mongoose";
import { RecurrentExpenseTypes } from "../types";

interface IReccurentExpenseModel
  extends Model<RecurrentExpenseTypes.RecurrentExpense> {}

const schema = new Schema<RecurrentExpenseTypes.RecurrentExpense>(
  {
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
    deleted: { type: Boolean, index: true, required: true },
    createdAt: { type: Date, index: true, required: true },
    updatedAt: { type: Date, index: true, required: true },
  },
  { timestamps: true }
);

const RecurrentExpense: IReccurentExpenseModel = model<
  RecurrentExpenseTypes.RecurrentExpense,
  IReccurentExpenseModel
>("RecurrentExpense", schema);

export default RecurrentExpense;
