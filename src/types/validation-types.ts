import { CriticalError } from "../errors/service-error";

export namespace ValidationTypes {
  export interface IValidationService {
    validateAccountMembership(userId: string, accountId: string): Promise<void>;
    validateAccountOwnership(userId: string, accountId: string): Promise<void>;
    validateAccountExist(accountId: string): Promise<void>;
  }

  export class AccountMembershipError extends CriticalError {
    constructor(protected readonly accountId: string) {
      super(
        `Can't finish operation, current user is not a member of account ${accountId}.`
      );
    }
  }

  export class AccountOwnernshipError extends CriticalError {
    constructor(protected readonly accountId: string) {
      super(
        `Can't finish operation, current user is not the admin of account ${accountId}.`
      );
    }
  }
}
