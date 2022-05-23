import { Model, Schema, model, Document } from "mongoose";
import { UserTypes } from "../types";

export interface IUser extends Document, UserTypes.UserDetails {}

interface IUserModel extends Model<IUser> {}

const schema = new Schema<IUser>(
  {
    uuid: { type: String, index: true, required: true },
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

const User: IUserModel = model<IUser, IUserModel>("User", schema);

export default User;
