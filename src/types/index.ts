export * from "./user-types";
export * from "./logger-types";
export * from "./mongo-types";
export * from "./account-types";
export * from "./accounting-types";
export * from "./account-configuration-types";
export * from "./expense-processor-types";
export * from "./expense-sheets-types";
export * from "./recurrent-expense-types";
export * from "./auth-types";
export * from "./config-types";

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

export class CriticalError extends Error {
  constructor(
    msg: string,
    private readonly reason?: any,
    private readonly data?: any
  ) {
    super(msg);
  }
}

export class ValidationError extends Error {
  constructor(
    msg: string,
    private readonly reason?: any,
    private readonly data?: any
  ) {
    super(msg);
  }
}
