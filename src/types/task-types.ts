import { RecurrentExpenseTypes } from "./recurrent-expense-types";

// tslint:disable-next-line: no-namespace
export namespace TaskTypes {
  export interface ITaskService {
    run(): Promise<void>;
    runTask(id: string): Promise<void>;
    addTask(task: ITask): Promise<void>;
  }

  export interface ITask {
    run(): Promise<void>;
    schedule(): Promise<void>;
    getId(): string;
  }

  export type TaskServiceConfiguration = {
    refreshConfigsTaskOptions: TaskOptions;
    addNewExpenseTaskOptions: AddNewExpenseTaskOptions;
    addRecurrentExpensesOptions: {
      monthly: AddRecurrentExpensesTaskOptions;
      medianly: AddRecurrentExpensesTaskOptions;
      semesterly: AddRecurrentExpensesTaskOptions;
    };
    sendAccountSummeryTaskOptions: SendAccountSummeryTaskOptions;
  };

  export interface TaskOptions {
    cronInterval: string;
    isEnabled: boolean;
  }

  export interface AddNewExpenseTaskOptions extends TaskOptions {
    creditProvidersUrlMap: { [key: string]: string };
  }
  export interface AddRecurrentExpensesTaskOptions extends TaskOptions {
    recurrence: RecurrentExpenseTypes.Recurrence;
  }
  export interface SendAccountSummeryTaskOptions extends TaskOptions {}

  export namespace Requests {
    export interface RunTaskRequest {
      id: string;
    }
  }
}
