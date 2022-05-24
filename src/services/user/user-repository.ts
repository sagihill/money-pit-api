import { MongoRepository } from "../../lib/repository";
import User from "../../models/User";
import { MongoTypes, UserTypes } from "../../types";
import { Model } from "mongoose";

export const getUserRepository = () => {
  return new UserRepository(User);
};

export class UserRepository
  extends MongoRepository<UserTypes.UserDetails, UserTypes.EditUserRequest>
  implements
    UserTypes.IUserRepository,
    MongoTypes.Repository<UserTypes.UserDetails, UserTypes.EditUserRequest>
{
  constructor(model: Model<UserTypes.UserDetails>) {
    super(model);
  }
}
