import { Model, Schema, model } from "mongoose";
import { AccountConfigurationTypes } from "../types";

interface ISalaryModel extends Model<AccountConfigurationTypes.Salary> {}

const schema = new Schema<AccountConfigurationTypes.Salary>({
  id: { type: String, index: true, required: true },
  accountId: { type: String, index: true, required: true },
  amount: { type: Number, index: true, required: true },
  currency: { type: String, index: true, required: true },
  payDay: { type: Number, index: true, required: true },
});

const Salary: ISalaryModel = model<
  AccountConfigurationTypes.Salary,
  ISalaryModel
>("AccountConfiguration", schema);

export default Salary;
