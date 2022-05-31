import { MongoRepository } from "../../lib/repository";
import ProcessorLog from "../../models/ProcessorLog";
import { MongoTypes, LoggerTypes, ExpenseProcessorTypes } from "../../types";
import { Model } from "mongoose";

export const getProcessorLogsRepository = (logger: LoggerTypes.ILogger) => {
  return new ProcessorLogsRepository(ProcessorLog, logger);
};

export class ProcessorLogsRepository
  implements ExpenseProcessorTypes.IProcessorLogsRepository
{
  constructor(
    private readonly model: Model<ExpenseProcessorTypes.ProcessorLog>,
    private readonly logger: LoggerTypes.ILogger
  ) {}

  async add(log: ExpenseProcessorTypes.ProcessorLog): Promise<void> {
    const modelInstance = new this.model(log);
    await modelInstance.save();
  }

  async isAllreadyProcessed(fileId: string): Promise<boolean> {
    const doc = await this.model.findOne({ fileId });
    return !!doc;
  }
}
