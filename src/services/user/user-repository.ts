import User from "../../models/User";
import { UserTypes } from "../../types";

export class UserRepository implements UserTypes.IUserRepository {
  constructor() {}

  async add(
    userDetails: UserTypes.UserDetails
  ): Promise<UserTypes.UserDetails> {
    const user = new User(userDetails);
    const doc = await user.save();
    return doc.toObject();
  }
  async edit(uuid: string, request: UserTypes.EditUserRequest): Promise<void> {
    await User.findOneAndUpdate({ uuid }, { ...request });
  }
  async get(uuid: string): Promise<UserTypes.UserDetails | undefined> {
    const doc = await User.findOne({ uuid });
    if (doc) {
      return doc.toObject();
    }
  }
  async remove(uuid: string): Promise<void> {
    await User.findOneAndUpdate({ uuid }, { deleted: true });
  }
}
