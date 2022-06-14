import { MongoRepository } from "../../lib/repository";
import User from "../../models/User";
import { UserTypes } from "../../types";

export const getUserRepository = () => {
  return new UserRepository(User);
};

export class UserRepository extends MongoRepository<
  UserTypes.UserDetails,
  UserTypes.Requests.UpdateRequest
> {}
