import { CriticalError } from "../errors/service-error";

export namespace TechTypes {
  export type Credentials = {
    username: string;
    password: string;
  };

  export type ApiResponse = {
    status: ResponseStatus;
    message: string;
    data?: any;
    error?: any;
  };

  export enum ResponseStatus {
    success = "sucesss",
    failure = "failure",
    error = "error",
  }

  export interface IContext {
    currentUserId?: string;
  }

  export class RequiredParameterError extends CriticalError {
    constructor(protected readonly parameter: string) {
      super(`Can't finish operation, ${parameter} is a required parameter.`);
    }
  }
}
