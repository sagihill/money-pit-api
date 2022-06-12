import { MongoRepository } from "../../lib/repository";
import CreditAccount from "../../models/CreditAccount";
import { CreditAccountTypes } from "../../types";

export const getCreditAccountRepository = () => {
  return new CreditAccountRepository(CreditAccount);
};

export class CreditAccountRepository extends MongoRepository<
  CreditAccountTypes.CreditAccount,
  CreditAccountTypes.Requests.UpdateRequest
> {}
