import { MongoRepository } from "../../lib/repository";
import User from "../../models/User";
import { UserTypes } from "../../types";

export const getUserRepository = () => {
  return new MongoRepository<UserTypes.UserDetails, UserTypes.EditUserRequest>(
    User
  );
};
