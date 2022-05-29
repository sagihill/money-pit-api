import { IEntityDetails, AccountingTypes, Currency, Credentials } from ".";

// tslint:disable-next-line: no-namespace
export namespace AccountTypes {
  export interface IAccountService {
    add(request: AddAccountRequest): Promise<AccountDetails>;
    edit(id: string, request: EditAccountRequest): Promise<void>;
    get(id: string): Promise<AccountDetails | undefined>;
    remove(id: string): Promise<void>;

    getCreditAccounts(): Promise<CreditAccount[]>;
  }

  export interface IAccountRepository {
    add(accountDetails: AccountDetails): Promise<AccountDetails>;
    edit(id: string, request: EditAccountRequest): Promise<void>;
    get(id: string): Promise<AccountDetails | undefined>;
    remove(id: string): Promise<void>;

    getCreditAccounts(): Promise<CreditAccount[]>;
  }

  export interface AccountDetails extends IEntityDetails {
    id: string;
    type: AccountType;
    adminUserId: string;
    configuration: AccountConfiguration;
  }

  export type AccountConfiguration = {
    members: string[];
    incomes: AccountingTypes.Salary[];
    creditAccountsConfig?: CreditAccountConfig[];
    budget?: Budget;
    recurrentExpenses?: RecurrentExpense[];
  };

  export type Budget = {
    totalBudget?: number;
    categoriesBudget?: {
      [key: string]: number;
    };
  };

  export type CreditAccount = {
    accountId: string;
    creditAccountsConfig: CreditAccountConfig[];
  };

  export type CreditAccountConfig = {
    creditProvider: CreditProvider;
    credentials: Credentials;
  };

  export enum CreditProvider {
    Max = "max",
  }

  export type RecurrentExpense = {
    category: AccountingTypes.ExpenseCategory;
    name: string;
    type: AccountingTypes.ExpenseType;
    description?: string;
    amount: number;
    currency: Currency;
    dueDay: number;
    recurrence: Recurrence;
  };

  export enum Recurrence {
    Monthly = "monthly",
    Semesterly = "semesterly",
    Quarterly = "quarterly",
    Medianly = "medianly",
  }

  export interface EditAccountRequest {
    configuration?: {
      members?: string[];
      incomes?: AccountingTypes.Salary[];
      budget?: Budget;
      creditAccountsConfig?: CreditAccountConfig[];

      // recurrentExpenses?: RecurrentExpense[];
    };
  }

  export type AddAccountRequest = {
    type: AccountType;
    adminUserId: string;
    configuration: AccountConfiguration;
  };

  export type AddAccountNetworkRequest = {
    type: AccountType;
    configuration: {
      incomes: AccountingTypes.Salary[];
      creditAccountsConfig?: CreditAccountConfig[];
      budget?: Budget;
      recurrentExpenses?: RecurrentExpense[];
    };
  };

  export enum AccountType {
    Family = "family",
    Single = "single",
  }
}
