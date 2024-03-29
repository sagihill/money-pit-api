import { DomainTypes } from ".";
import { CriticalError, ValidationError } from "../errors/service-error";
import { MongoTypes } from "./mongo-types";

// tslint:disable-next-line: no-namespace
export namespace AccountingTypes {
  export interface IAccountingService
    extends DomainTypes.IAccountSimpleService<
      Expense,
      Requests.AddRequest,
      Requests.UpdateRequest
    > {
    addExpenses(expenses: Expense[]): Promise<void>;
    getAccountSummery(
      accountId: string,
      chargeMonth: DomainTypes.ChargeMonth
    ): Promise<AccountSummery>;
    createNewExpense(request: Requests.AddRequest): Promise<Expense>;
  }

  export interface IAccountingRepository
    extends MongoTypes.Repository<Expense, Requests.UpdateRequest> {
    addExpenses(expenses: Expense[]): Promise<void>;
  }

  export type AccountingServiceConfiguration = {
    accountingSummeryDatesWindow: {
      lowerChargeDay: number;
      upperChargeDay: number;
      lowerTimestampDay: number;
      upperTimestampDay: number;
    };
  };

  export type AccountSummery = {
    incomeAmount: number;
    totalBudget: number;
    expenseAmount: number;
    balance: number;
    categoriesSummery: CategoriesSummery;
  };

  export type CategoriesSummery = {
    [key: string]: CategorySummery;
  };

  export type CategorySummery = {
    expenseAmount: number;
    budget?: number;
    balance?: number;
  };
  export interface Expense extends DomainTypes.IEntityDetails {
    id: string;
    accountId: string;
    category: ExpenseCategory;
    name: string;
    type: ExpenseType;
    description?: string;
    amount: number;
    currency: DomainTypes.Currency;
    timestamp: Date;
    chargeDate?: Date;
  }

  export enum ExpenseType {
    Regular = "regular",
    Installments = "installments",
    Subscription = "subscription",
  }

  export interface Income extends DomainTypes.IEntityDetails {
    id?: string;
    accountId: string;
    amount: number;
    timestamp?: Date;
    currency: DomainTypes.Currency;
  }

  export enum ExpenseCategory {
    Consumption = "consumption",
    Groceries = "groceries",
    FuelGasAndElectricity = "fuel_gas_and_electricity",
    GovAndMuni = "goverment_and_municipality",
    Insurance = "insurance",
    Medical = "medical",
    CommunicationServices = "communication_services",
    Mia = "mia",
    Other = "other",
    Home = "home",
    Fitness = "fitness",
    BeautyAndGrooming = "beauty_and_grooming",
    InternetSubscriptions = "internet_subscriptions",
    Transportation = "transportation",
  }

  export namespace Requests {
    export interface UpdateRequest {
      category: ExpenseCategory;
      name: string;
      amount: number;
      currency: DomainTypes.Currency;
      type: ExpenseType;
      description: string;
      timestamp: Date;
    }
    export interface AddRequest {
      id?: string;
      accountId: string;
      category: ExpenseCategory;
      name: string;
      amount: number;
      currency: DomainTypes.Currency;
      type: ExpenseType;
      timestamp?: Date;
      description?: string;
    }
    export interface GetSummeryRequest {
      chargeMonth: DomainTypes.ChargeMonth;
    }
  }

  export class InvalidExpenseCategory extends CriticalError {
    constructor(private readonly category: ExpenseCategory) {
      super(
        `Can't finish operation. expense category ${category} is an invalid value.`
      );
    }
  }
  export class InvalidExpenseType extends CriticalError {
    constructor(private readonly type: ExpenseType) {
      super(
        `Can't finish operation. expense type ${type} is an invalid value.`
      );
    }
  }
  export class ExpenseSummeryEmpty extends ValidationError {
    constructor(private readonly chargeMonth: DomainTypes.ChargeMonth) {
      super(
        `Can't get expense summery. there are no expenses for ${chargeMonth.month}/${chargeMonth.year} month.`
      );
    }
  }
}
