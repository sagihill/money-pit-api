import { Credentials, CriticalError, IEntityDetails, ISimpleService } from ".";

// tslint:disable-next-line: no-namespace
export namespace AccountConfigurationTypes {
  export interface IAccountConfigurationService
    extends ISimpleService<
      AccountConfiguration,
      Requests.AddRequest,
      Requests.UpdateRequest
    > {
    findConfigurations(
      request: Requests.FindRequest
    ): Promise<AccountConfiguration[] | undefined>;
  }

  export interface AccountConfiguration extends IEntityDetails {
    accountId: string;
    budget?: Budget;
    toggles?: {
      enableAutoExpenseAdd?: boolean;
    };
  }

  export interface Budget {
    totalBudget?: number;
    categoriesBudget?: {
      [key: string]: number;
    };
  }

  export class InvalidBudgetAmount extends CriticalError {
    constructor(amount: number) {
      super(
        `Can't finish operation. budget amount of ${amount} is an invalid value.`
      );
    }
  }

  export namespace Requests {
    export interface AddRequest {
      accountId: string;
      budget?: Budget;
      toggles?: {
        enableAutoExpenseAdd?: boolean;
      };
    }

    export interface UpdateRequest {
      budget?: Budget;
      toggles?: {
        enableAutoExpenseAdd?: boolean;
      };
    }

    export interface FindRequest {
      toggles?: {
        enableAutoExpenseAdd?: boolean;
      };
    }
  }
}
