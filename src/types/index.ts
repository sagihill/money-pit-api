import { CriticalError } from "../errors/service-error";

export * from "./user-types";
export * from "./logger-types";
export * from "./mongo-types";
export * from "./account-types";
export * from "./credit-account-types";
export * from "./accounting-types";
export * from "./account-configuration-types";
export * from "./salary-types";
export * from "./expense-processor-types";
export * from "./expense-sheets-types";
export * from "./recurrent-expense-types";
export * from "./auth-types";
export * from "./config-types";
export * from "./validation-types";

export interface IEntityDetails {
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ChargeMonth = {
  month: string;
  year: string;
};

export enum Currency {
  ILS = "ILS",
  USD = "USD",
  EUR = "EUR",
}

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

export interface ISimpleService<T, A, E> {
  add(request: A): Promise<T>;
  update(id: string, request: E): Promise<void>;
  remove(id: string): Promise<void>;
  get(id: string): Promise<T | undefined>;
}

export interface IContext {
  currentUserId?: string;
}

export class InvalidCurrency extends CriticalError {
  constructor(protected readonly currency: Currency) {
    super(`Can't finish operation. currency ${currency} is an invalid value.`);
  }
}
export class InvalidAmount extends CriticalError {
  constructor(protected readonly amount: number) {
    super(`Can't finish operation. amount ${amount} is an invalid value.`);
  }
}
export class InvalidStringValue extends CriticalError {
  constructor(
    protected readonly str: string,
    protected readonly fieldName: string
  ) {
    super(
      `Can't finish operation. value ${str} as field ${fieldName} is an invalid value.`
    );
  }
}
export class InvalidDay extends CriticalError {
  constructor(protected readonly day: number) {
    super(`Can't finish operation. day ${day} is an invalid value.`);
  }
}

export class RequiredParameterError extends CriticalError {
  constructor(protected readonly parameter: string) {
    super(`Can't finish operation, ${parameter} is a required parameter.`);
  }
}
