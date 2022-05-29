// tslint:disable-next-line: no-namespace
export namespace TaskTypes {
  export interface ITaskService {
    run(): Promise<void>;
  }

  export interface ITask {
    run(): Promise<void>;
    schedule(): Promise<void>;
  }

  export type TaskOptions = {
    cronInterval: string;
  };
}
