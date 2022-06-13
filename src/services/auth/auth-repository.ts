import Auth from "../../models/Auth";
import { AuthTypes } from "../../types";
import { Model } from "mongoose";

export const getAuthRepository = () => {
  return new AuthRepository(Auth);
};

export class AuthRepository implements AuthTypes.IAuthRepository {
  constructor(private readonly authModel: Model<AuthTypes.Auth>) {}

  async save(auth: AuthTypes.Auth): Promise<void> {
    const modelInstance = new this.authModel(auth);
    await modelInstance.save();
  }

  async get(token: string): Promise<AuthTypes.Auth | undefined> {
    const doc = await this.authModel.findOne({ token });
    if (doc) {
      return this.deserialize(doc.toObject());
    }
  }

  /**
   * Deserializes a DB record into a domain type.
   * @param src A record object coming from the DB.
   */
  deserialize(src: any): AuthTypes.Auth {
    delete src.deleted;
    delete src._id;
    delete src.__v;
    return { ...src } as AuthTypes.Auth;
  }
}
