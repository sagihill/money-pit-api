import { Model, Schema, model } from "mongoose";
import { UserTypes } from "../types";

interface IUserModel extends Model<UserTypes.UserDetails> {}

const schema = new Schema<UserTypes.UserDetails>(
  {
    id: { type: String, index: true, required: true },
    accountId: { type: String, index: true, required: false },
    firstName: { type: String, index: true, required: true },
    lastName: { type: String, index: true, required: true },
    email: { type: String, index: true, required: true },
    deleted: { type: Boolean, index: true, required: true },
    createdAt: { type: Date, index: true, required: true },
    updatedAt: { type: Date, index: true, required: true },
  },
  { timestamps: true }
);

const User: IUserModel = model<UserTypes.UserDetails, IUserModel>(
  "User",
  schema
);

export default User;
