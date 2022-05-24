import { EntityDetails, AccountingTypes } from ".";

// tslint:disable-next-line: no-namespace
export namespace AccountTypes {
  export interface IAccountService {
    add(request: AddAccountRequest): Promise<AccountDetails>;
    edit(id: string, request: EditAccountRequest): Promise<void>;
    get(id: string): Promise<AccountDetails | undefined>;
    remove(id: string): Promise<void>;
  }

  export interface IAccountRepository {
    add(accountDetails: AccountDetails): Promise<AccountDetails>;
    edit(id: string, request: EditAccountRequest): Promise<void>;
    get(id: string): Promise<AccountDetails | undefined>;
    remove(id: string): Promise<void>;
  }

  export interface AccountDetails extends EntityDetails {
    id: string;
    type: AccountType;
    adminUserId: string;
    members: string[];
    income: AccountingTypes.Salary;
  }

  export interface EditAccountRequest {
    income?: AccountingTypes.Salary;
  }

  export type AddAccountRequest = {
    type: AccountType;
    adminUserId: string;
    members: string[];
    income: AccountingTypes.Salary;
  };
  export type AddAccountNetworkRequest = {
    type: AccountType;
    income: AccountingTypes.Salary;
  };

  export enum AccountType {
    Family = "family",
    Single = "single",
  }
}
