import { Model, Schema, model } from "mongoose";
import { SalaryTypes } from "../types";
import BaseEntitySchema from "./Base";

interface ISalaryModel extends Model<SalaryTypes.Salary> {}

const schema = new Schema<SalaryTypes.Salary>({
  id: { type: String, index: true, required: true },
  accountId: { type: String, index: true, required: true },
  amount: { type: Number, index: true, required: true },
  currency: { type: String, index: true, required: true },
  payDay: { type: Number, index: true, required: true },
  ...BaseEntitySchema,
});

const Salary: ISalaryModel = model<SalaryTypes.Salary, ISalaryModel>(
  "Salary",
  schema
);

export default Salary;
