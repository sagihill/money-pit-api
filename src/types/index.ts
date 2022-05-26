export * from "./user-types";
export * from "./logger-types";
export * from "./mongo-types";
export * from "./account-types";
export * from "./accounting-types";
export * from "./expense-processor-types";
export * from "./auth-types";
export * from "./config-types";

export interface IEntityDetails {
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type TimeFrame = {
  from: Date;
  to: Date;
};

export enum Currency {
  ILS = "ILS",
  USD = "USD",
  EUR = "EUR",
}
