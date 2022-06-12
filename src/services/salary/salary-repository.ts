import { MongoRepository } from "../../lib/repository";
import Salary from "../../models/Salary";
import { SalaryTypes } from "../../types";

export const getSalaryRepository = () => {
  return new SalaryRepository(Salary);
};

export class SalaryRepository extends MongoRepository<
  SalaryTypes.Salary,
  SalaryTypes.Requests.UpdateRequest
> {}
