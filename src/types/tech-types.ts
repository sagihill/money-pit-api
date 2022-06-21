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

  export interface IMigrationService {
    migrate(): Promise<void>;
  }

  export interface IMigrationRepository {
    save(migration: Migration): Promise<void>;
    isMigrated(id: string): Promise<boolean>;
  }

  export interface MigrationServiceOptions {}

  export interface Migration {
    id: string;
    name: string;
    migratedAt?: Date;
  }

  export class RequiredParameterError extends CriticalError {
    constructor(protected readonly parameter: string) {
      super(`Can't finish operation, ${parameter} is a required parameter.`);
    }
  }
  export class AuthTokenMissingError extends CriticalError {
    constructor() {
      super(`Can't finish operation, Authorization token is missing.`);
    }
  }
}
