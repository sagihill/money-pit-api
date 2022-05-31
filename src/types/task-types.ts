// tslint:disable-next-line: no-namespace
export namespace TaskTypes {
  export interface ITaskService {
    run(): Promise<void>;
  }

  export interface ITask {
    run(): Promise<void>;
    schedule(): Promise<void>;
  }

  export type TaskServiceConfiguration = {
    addNewExpenseTaskOptions: AddNewExpenseTaskOptions;
  };

  export interface TaskOptions {
    cronInterval: string;
    isEnabled: boolean;
  }

  export interface AddNewExpenseTaskOptions extends TaskOptions {
    creditProvidersUrlMap: { [key: string]: string };
  }
}
