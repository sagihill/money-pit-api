import { Model, Schema, model } from "mongoose";
import { ExpenseProcessorTypes } from "../types";

interface IProcessorLogModel
  extends Model<ExpenseProcessorTypes.ProcessorLog> {}

const schema = new Schema<ExpenseProcessorTypes.ProcessorLog>(
  {
    fileId: { type: String, index: true, required: true, unique: true },
    processedAt: { type: Date, index: true, required: true },
  },
  { timestamps: true }
);

const ProcessorLog: IProcessorLogModel = model<
  ExpenseProcessorTypes.ProcessorLog,
  IProcessorLogModel
>("ProcessorLog", schema);

export default ProcessorLog;
