import { parseExpression } from "cron-parser";
import { TaskTypes } from "../../../types/task-types";
import { LoggerTypes } from "../../../types";
import { Async } from "../../../lib";

export abstract class BaseTask implements TaskTypes.ITask {
  constructor(
    protected readonly taskId: string,
    protected readonly options: TaskTypes.TaskOptions,
    protected readonly logger: LoggerTypes.ILogger
  ) {}

  abstract run(): Promise<void>;

  protected isEnabled(): void {
    if (!this.options.isEnabled) {
      this.logger.info("Task is not enabled, skipping.");
    }
  }

  async schedule(): Promise<void> {
    const interval = this.getInterval(this.options.cronInterval);
    Async.setTimeoutExtended(async () => {
      if (!this.options.isEnabled) {
        this.logger.info(
          `Task '${this.constructor.name}' is not enabled, skipping.`
        );
      } else {
        await this.run();
      }
      await this.schedule();
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
      throw new Error("Cron interval is invalid");
    }
    if (!interval || !interval.hasNext()) {
      throw new Error("Cron interval is invalid");
    }
    return interval.next().getTime() - Date.now();
  }

  protected getOptions<T>(): T {
    return this.options as unknown as T;
  }

  getId(): string {
    return this.taskId;
  }
}
