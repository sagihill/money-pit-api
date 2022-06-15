import { AccountingTypes, DomainTypes } from ".";

// tslint:disable-next-line: no-namespace
export namespace SalaryTypes {
  export interface ISalaryService
    extends DomainTypes.IAccountSimpleService<
      Salary,
      Requests.AddRequest,
      Requests.UpdateRequest
    > {
    addSalaries(requests: Requests.AddRequest[]): Promise<Salary[]>;
    findSalaries(request: Requests.FindRequest): Promise<Salary[]>;
  }

  export interface Salary extends AccountingTypes.Income {
    payDay: number;
  }

  export namespace Requests {
    export interface AddRequest {
      accountId: string;
      amount: number;
      currency: DomainTypes.Currency;
      payDay: number;
    }
    export interface UpdateRequest {
      amount?: number;
      currency?: DomainTypes.Currency;
      payDay?: number;
    }
    export interface FindRequest {
      accountId: string;
      payDay?: number;
    }
  }
}
