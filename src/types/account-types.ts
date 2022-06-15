import { string } from "joi";
import {
  AccountConfigurationTypes,
  SalaryTypes,
  CreditAccountTypes,
  DomainTypes,
  RecurrentExpenseTypes,
} from ".";
import { CriticalError } from "../errors/service-error";

// tslint:disable-next-line: no-namespace
export namespace AccountTypes {
  export interface IAccountService
    extends DomainTypes.ISimpleService<
      AccountDetails,
      Requests.AddRequest,
      Requests.UpdateRequest
    > {
    getByAdminUserId(adminUserId: string): Promise<AccountDetails | undefined>;
    addAccountConfigurations(
      request: AccountTypes.Requests.AddAccountConfigurationRequest
    ): Promise<void>;
    getAccountIdByUserId(userId: string): Promise<string | undefined>;
  }
  export interface IAccountReaderService {
    getByAdminUserId(adminUserId: string): Promise<AccountDetails | undefined>;
    getAccountIdByUserId(userId: string): Promise<string | undefined>;
    get(id: string): Promise<AccountDetails | undefined>;
  }
  export interface AccountDetails extends DomainTypes.IEntityDetails {
    id: string;
    type: AccountType;
    adminUserId: string;
    members: string[];
  }

  export interface AccountUserPair extends DomainTypes.IEntityDetails {
    id: string;
    accountId: string;
    userId: string;
  }

  export enum AccountType {
    Family = "family",
    Single = "single",
  }
  export namespace Requests {
    export interface UpdateRequest {
      type?: AccountType;
    }

    export type AddNetworkRequest = {
      type: AccountType;
      adminUserId: string;
      configuration?: AccountConfigurationTypes.Requests.AddRequest;
      salaries?: SalaryTypes.Requests.AddRequest[];
      creditAccounts?: CreditAccountTypes.Requests.AddRequest[];
      recurrentExpenses?: RecurrentExpenseTypes.Requests.AddRequest[];
    };

    export type AddRequest = {
      type: AccountType;
      adminUserId: string;
    };

    export type AddAccountConfigurationRequest = {
      configuration?: AccountConfigurationTypes.Requests.AddRequest;
      salaries?: SalaryTypes.Requests.AddRequest[];
      creditAccounts?: CreditAccountTypes.Requests.AddRequest[];
      recurrentExpenses?: RecurrentExpenseTypes.Requests.AddRequest[];
    };
  }

  export class InvalidAccountType extends CriticalError {
    constructor(protected readonly type: AccountType) {
      super(
        `Can't finish operation. account type ${type} is an invalid value.`
      );
    }
  }

  export class AccountNotFound extends CriticalError {
    constructor(protected readonly accountId: string) {
      super(`Can't finish operation, account_${accountId} is not found.`);
    }
  }
  export class AccountAdditionError extends CriticalError {
    constructor() {
      super(`Can't finish account adding, somthing went wrong.`);
    }
  }
}
