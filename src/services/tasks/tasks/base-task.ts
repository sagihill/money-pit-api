import { TaskTypes } from "../../../types/task-types";
import { parseExpression } from "cron-parser";
import { LoggerTypes } from "../../../types";

export abstract class BaseTask implements TaskTypes.ITask {
  constructor(
    private readonly options: TaskTypes.TaskOptions,
    private readonly logger: LoggerTypes.ILogger
  ) {}

  abstract run(): Promise<void>;

  async schedule(): Promise<void> {
    const interval = this.getInterval(this.options.cronInterval);

    setTimeout(async () => {
      await this.run();
    }, interval);
  }

  private getInterval(cronInterval: string): number {
    let interval: any;
    try {
      interval = parseExpression(cronInterval, {
        utc: true,
      });
    } catch (e) {
      this.logger.error(
        "Could not start task runner, could not parse cron interval"
      );
      throw new Error(`Cron interval is invalid`);
    }
    if (!interval || !interval.hasNext()) {
    }
    return interval.next().getTime() - Date.now();
  }
}
