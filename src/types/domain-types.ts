import { CriticalError } from "../errors/service-error";

export namespace DomainTypes {
  export interface ISimpleService<T, A, E> {
    add(request: A): Promise<T>;
    update(id: string, request: E): Promise<void>;
    remove(id: string): Promise<void>;
    get(id: string): Promise<T | undefined>;
  }

  export interface IAccountSimpleService<T, A, E>
    extends ISimpleService<T, A, E> {
    removeAccountOne(id: string, accountId: string): Promise<void>;
    findAccountOne(id: string, accountId: string): Promise<T | undefined>;
    updateAccountOne(id: string, accountId: string, request: E): Promise<void>;
  }

  export interface ISimpleErrorParser {
    parse(error: Error): Promise<Error>;
  }

  export interface IEntityDetails {
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
  }

  export type ChargeMonth = {
    month: string;
    year: string;
  };

  export enum Currency {
    ILS = "ILS",
    USD = "USD",
    EUR = "EUR",
  }

  export class InvalidCurrency extends CriticalError {
    constructor(protected readonly currency: DomainTypes.Currency) {
      super(
        `Can't finish operation. currency ${currency} is an invalid value.`
      );
    }
  }
  export class InvalidAmount extends CriticalError {
    constructor(protected readonly amount: number) {
      super(`Can't finish operation. amount ${amount} is an invalid value.`);
    }
  }
  export class InvalidStringValue extends CriticalError {
    constructor(
      protected readonly str: string,
      protected readonly fieldName: string
    ) {
      super(
        `Can't finish operation. value ${str} as field ${fieldName} is an invalid value.`
      );
    }
  }
  export class InvalidDay extends CriticalError {
    constructor(protected readonly day: number) {
      super(`Can't finish operation. day ${day} is an invalid value.`);
    }
  }
  export class NonUniqueError extends CriticalError {
    constructor(protected fields: string[]) {
      super(
        `The values for [${fields.join(
          ","
        )}] are allready used. please choose different values.`
      );
    }
  }
}
