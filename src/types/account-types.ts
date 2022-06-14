import {
  IEntityDetails,
  AccountConfigurationTypes,
  SalaryTypes,
  CreditAccountTypes,
  ISimpleService,
  RecurrentExpenseTypes,
} from ".";
import { CriticalError } from "../errors/service-error";

// tslint:disable-next-line: no-namespace
export namespace AccountTypes {
  export interface IAccountService
    extends ISimpleService<
      AccountDetails,
      Requests.AddRequest,
      Requests.UpdateRequest
    > {
    getByAdminUserId(adminUserId: string): Promise<AccountDetails | undefined>;
  }
  export interface IAccountReaderService {
    getByAdminUserId(adminUserId: string): Promise<AccountDetails | undefined>;
    get(id: string): Promise<AccountDetails | undefined>;
  }
  export interface AccountDetails extends IEntityDetails {
    id: string;
    type: AccountType;
    adminUserId: string;
    members: string[];
  }

  export enum AccountType {
    Family = "family",
    Single = "single",
  }
  export namespace Requests {
    export interface UpdateRequest {
      type?: AccountType;
    }

    export type AddRequest = {
      type: AccountType;
      adminUserId: string;
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
}
