import { AccountTypes, TechTypes, ValidationTypes } from "../../types";

export class ValidationService implements ValidationTypes.IValidationService {
  constructor(
    private readonly accountService: AccountTypes.IAccountReaderService
  ) {}

  async validateAccountMembership(
    userId: string,
    accountId: string
  ): Promise<void> {
    const account = await this.accountService.get(accountId);
    if (!account) {
      throw new AccountTypes.AccountNotFound(accountId);
    }
    if (!account.members.includes(userId)) {
      throw new ValidationTypes.AccountMembershipError(accountId);
    }
  }

  async validateAccountOwnership(
    userId: string,
    accountId: string
  ): Promise<void> {
    const account = await this.accountService.get(accountId);
    if (!account) {
      throw new AccountTypes.AccountNotFound(accountId);
    }
    if (account.adminUserId !== userId) {
      throw new ValidationTypes.AccountOwnernshipError(accountId);
    }
  }

  async validateAccountExist(accountId: string): Promise<void> {
    if (!accountId) {
      throw new TechTypes.RequiredParameterError("accountId");
    }

    const account = await this.accountService.get(accountId);

    if (!account) {
      throw new AccountTypes.AccountNotFound(accountId);
    }
  }
}
