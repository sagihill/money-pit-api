import { AccountingTypes, Credentials, IEntityDetails } from ".";
import { MongoRepository } from "../lib";
import { RecurrentExpenseTypes } from "./recurrent-expense-types";

// tslint:disable-next-line: no-namespace
export namespace AccountConfigurationTypes {
  export interface IAccountConfigurationService {
    findConfigurations(
      request: Requests.FindConfigurationRequest
    ): Promise<AccountConfiguration[] | undefined>;
    getAccountConfiguration(
      accountId: string
    ): Promise<AccountConfiguration | undefined>;
    update(
      accountId: string,
      request: Requests.UpdateConfigurationRequest
    ): Promise<void>;
  }

  export interface IAccountConfigurationRepository
    extends MongoRepository<
      AccountConfiguration,
      Requests.UpdateConfigurationRequest
    > {
    update(
      accountId: string,
      request: Requests.UpdateConfigurationRequest
    ): Promise<void>;
    findConfigurations(
      request: Requests.FindConfigurationRequest
    ): Promise<AccountConfiguration[] | undefined>;
  }

  export interface AccountConfigurationForDisplay {
    incomes?: Salary[];
    budget?: Budget;
    recurrentExpenses?: RecurrentExpenseTypes.RecurrentExpense[];
    toggles?: {
      enableAutoExpenseAdd?: boolean;
    };
  }

  export interface AccountConfiguration extends IEntityDetails {
    accountId: string;
    incomes?: Salary[];
    creditAccounts?: CreditAccount[];
    budget?: Budget;
    recurrentExpenses?: RecurrentExpenseTypes.RecurrentExpense[];
    toggles?: {
      enableAutoExpenseAdd?: boolean;
    };
  }

  export interface CreditAccount {
    id?: string;
    creditProvider: CreditProvider;
    credentials: Credentials;
  }

  export interface Salary extends AccountingTypes.Income {
    payDay: number;
  }

  export enum CreditProvider {
    Max = "max",
  }

  export interface Budget {
    totalBudget?: number;
    categoriesBudget?: {
      [key: string]: number;
    };
  }

  export namespace Requests {
    export interface FindConfigurationRequest {
      toggles?: {
        enableAutoExpenseAdd?: boolean;
      };
    }
    export interface UpdateConfigurationNetworkRequest {
      accountId: string;
      incomes?: Salary[];
      creditAccounts?: CreditAccount[];
      budget?: Budget;
      recurrentExpenses?: RecurrentExpenseTypes.RecurrentExpense[];
      toggles?: {
        enableAutoExpenseAdd?: boolean;
      };
    }

    export interface UpdateConfigurationRequest {
      incomes?: Salary[];
      creditAccounts?: CreditAccount[];
      budget?: Budget;
      recurrentExpenses?: RecurrentExpenseTypes.RecurrentExpense[];
      toggles?: {
        enableAutoExpenseAdd?: boolean;
      };
    }
  }
}
