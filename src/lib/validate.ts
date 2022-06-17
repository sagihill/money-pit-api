import {
  AccountingTypes,
  AccountTypes,
  DomainTypes,
  RecurrentExpenseTypes,
  TechTypes,
} from "../types";

export namespace Validate {
  export function isValidAmount(amount?: number): boolean {
    return (
      !Number.isNaN(amount) &&
      Number.isInteger(amount) &&
      Number.isFinite(amount)
    );
  }

  export function expenseCategory(category?: AccountingTypes.ExpenseCategory) {
    if (
      category &&
      !Object.values(AccountingTypes.ExpenseCategory).includes(
        category as AccountingTypes.ExpenseCategory
      )
    ) {
      throw new AccountingTypes.InvalidExpenseCategory(
        category as AccountingTypes.ExpenseCategory
      );
    }

    return {
      required: () => required(category, "category"),
    };
  }

  export function expenseType(type?: AccountingTypes.ExpenseType) {
    if (
      type &&
      !Object.values(AccountingTypes.ExpenseType).includes(
        type as AccountingTypes.ExpenseType
      )
    ) {
      throw new AccountingTypes.InvalidExpenseType(
        type as AccountingTypes.ExpenseType
      );
    }

    return {
      required: () => required(type, "expense type"),
    };
  }

  export function currency(currency?: DomainTypes.Currency) {
    if (currency && !Object.values(DomainTypes.Currency).includes(currency)) {
      throw new DomainTypes.InvalidCurrency(currency);
    }

    return {
      required: () => required(currency, "currency"),
    };
  }

  export function day(day?: number) {
    if (
      day &&
      (Number.isNaN(day) ||
        !Number.isInteger(day) ||
        !Number.isFinite(day) ||
        day <= 0 ||
        day > 31)
    ) {
      throw new DomainTypes.InvalidDay(day);
    }

    return {
      required: () => required(day, "day"),
    };
  }

  export function expenseRecurrence(
    recurrence?: RecurrentExpenseTypes.Recurrence
  ) {
    if (
      recurrence &&
      !Object.values(RecurrentExpenseTypes.Recurrence).includes(recurrence)
    ) {
      throw new RecurrentExpenseTypes.InvalidRecurrence(recurrence);
    }

    return {
      required: () => required(recurrence, "expense recurrence"),
    };
  }

  export function amount(amount?: number) {
    if (amount && !isValidAmount(amount)) {
      throw new DomainTypes.InvalidAmount(amount);
    }

    return {
      required: () => required(amount, "amount"),
    };
  }

  export function string(fieldName: string, str?: string) {
    if (str && typeof str !== "string") {
      throw new DomainTypes.InvalidStringValue(str, fieldName);
    }

    return {
      required: () => required(str, fieldName),
    };
  }

  export function accountType(type?: AccountTypes.AccountType) {
    if (type && !Object.values(AccountTypes.AccountType).includes(type)) {
      throw new AccountTypes.InvalidAccountType(type);
    }

    return {
      required: () => required(type, "account type"),
    };
  }

  export function required(value: any, fieldName: string) {
    if (!value) {
      throw new TechTypes.RequiredParameterError(fieldName);
    }
  }
}
