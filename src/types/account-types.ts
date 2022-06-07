import { IEntityDetails, AccountConfigurationTypes } from ".";

// tslint:disable-next-line: no-namespace
export namespace AccountTypes {
  export interface IAccountService {
    add(request: Requests.AddAccountRequest): Promise<AccountDetails>;
    get(id: string): Promise<AccountDetails | undefined>;
    remove(id: string): Promise<void>;
    editConfiguration(
      id: string,
      request: AccountConfigurationTypes.Requests.UpdateConfigurationRequest
    ): Promise<void>;

    displayConfiguration(
      id: string
    ): Promise<AccountConfigurationTypes.AccountConfigurationForDisplay>;
  }

  export interface IAccountRepository {
    add(accountDetails: AccountDetails): Promise<AccountDetails>;
    edit(id: string, request: Requests.EditAccountRequest): Promise<void>;
    get(id: string): Promise<AccountDetails | undefined>;
    remove(id: string): Promise<void>;
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
    export interface EditAccountRequest {
      type?: AccountType;
    }

    export type AddAccountRequest = {
      type: AccountType;
      adminUserId: string;
      configuration: AccountConfigurationTypes.Requests.UpdateConfigurationRequest;
    };

    export type AddAccountNetworkRequest = {
      type: AccountType;
      configuration: AccountConfigurationTypes.Requests.UpdateConfigurationNetworkRequest;
    };
  }
}
