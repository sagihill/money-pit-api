import { ID } from "../../../lib";
import { ConfigTypes, LoggerTypes } from "../../../types";
import { TaskTypes } from "../../../types/task-types";
import { BaseTask } from "./base-task";

export class RefreshConfigsTask extends BaseTask implements TaskTypes.ITask {
  constructor(
    private readonly configService: ConfigTypes.IConfigService,
    options: TaskTypes.TaskOptions,
    logger: LoggerTypes.ILogger
  ) {
    super(ID.get(), options, logger);
  }

  async run(): Promise<void> {
    try {
      await this.configService.refresh();
    } catch (error: any) {
      this.logger.error(error);
    }
  }
}
