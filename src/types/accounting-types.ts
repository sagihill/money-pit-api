import { ChargeMonth, Currency, IEntityDetails } from ".";
import { MongoTypes } from "./mongo-types";

// tslint:disable-next-line: no-namespace
export namespace AccountingTypes {
  export interface IAccountingService {
    addExpenses(expenses: Expense[]): Promise<void>;
    editExpense(id: string, request: EditExpenseRequest): Promise<void>;
    getAccountSummery(
      accountId: string,
      chargeMonth: ChargeMonth
    ): Promise<AccountSummery>;
    createNewExpense(
      request: AccountingTypes.AddExpenseRequest
    ): AccountingTypes.Expense;
  }

  export interface IAccountingRepository
    extends MongoTypes.Repository<Expense, EditExpenseRequest> {
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
  export interface Expense extends IEntityDetails {
    id: string;
    accountId: string;
    category: ExpenseCategory;
    name: string;
    type: ExpenseType;
    description?: string;
    amount: number;
    currency: Currency;
    timestamp: Date;
    chargeDate?: Date;
  }

  export enum ExpenseType {
    Regular = "regular",
    Installments = "installments",
    Subscription = "subscription",
  }

  export interface EditExpenseRequest {
    category: ExpenseCategory;
    name: string;
    amount: number;
    currency: Currency;
    type: ExpenseType;
    description: string;
    timestamp: Date;
  }
  export interface AddExpenseRequest {
    id?: string;
    accountId: string;
    category: ExpenseCategory;
    name: string;
    amount: number;
    currency: Currency;
    type: ExpenseType;
    timestamp: Date;
    description?: string;
  }

  export interface GetSummeryRequest {
    chargeMonth: ChargeMonth;
  }

  export interface Income {
    id?: string;
    amount: number;
    timestamp?: Date;
    currency: Currency;
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
}
