import { Model, Schema, model } from "mongoose";
import { UserTypes } from "../types";
import BaseEntitySchema from "./Base";

interface IUserModel extends Model<UserTypes.UserDetails> {}

const schema = new Schema<UserTypes.UserDetails>(
  {
    id: { type: String, index: true, required: true, unique: true },
    accountId: { type: String, index: true, required: false },
    firstName: { type: String, index: true, required: true },
    lastName: { type: String, index: true, required: true },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: [true, "email not provided"],
      validate: {
        // eslint-disable-next-line object-shorthand
        validator: function (v: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "{VALUE} is not a valid email!",
      },
    },
    password: { type: String, index: false, required: true },
    role: {
      type: String,
      index: false,
      required: true,
      default: UserTypes.UserRole.Regular,
    },
    status: {
      type: String,
      index: false,
      required: true,
      default: UserTypes.UserStatus.PendingAuthentication,
    },
    ...BaseEntitySchema,
  },
  { timestamps: true, collection: "User" }
);

const User: IUserModel = model<UserTypes.UserDetails, IUserModel>(
  "User",
  schema
);

export default User;
