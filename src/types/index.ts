export * from "./user-types";
export * from "./logger-types";
export * from "./mongo-types";
export * from "./account-types";
export * from "./accounting-types";

export interface EntityDetails {
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
