import { Credentials, IEntityDetails, ISimpleService } from ".";
import { CriticalError } from "../errors/service-error";

// tslint:disable-next-line: no-namespace
export namespace CreditAccountTypes {
  export interface ICreditAccountService
    extends ISimpleService<
      CreditAccount,
      Requests.AddRequest,
      Requests.UpdateRequest
    > {
    addCreditAccounts(
      requests: Requests.AddRequest[]
    ): Promise<CreditAccount[]>;
    findCreditAccounts(request: Requests.FindRequest): Promise<CreditAccount[]>;
  }

  export interface CreditAccount extends IEntityDetails {
    id?: string;
    accountId: string;
    creditProvider: CreditProvider;
    credentials: Credentials;
  }

  export enum CreditProvider {
    Max = "max",
  }

  export class InvalidCreditProvider extends CriticalError {
    constructor(provider: CreditProvider) {
      super(
        `Can't finish operation. credit provider ${provider} is an invalid value.`
      );
    }
  }

  export namespace Requests {
    export interface AddRequest {
      accountId: string;
      creditProvider: CreditProvider;
      credentials: Credentials;
    }
    export interface UpdateRequest {
      creditProvider?: CreditProvider;
      credentials?: Credentials;
    }

    export interface FindRequest {
      accountId?: string;
    }
  }
}
