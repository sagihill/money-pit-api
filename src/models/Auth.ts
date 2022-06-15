import { Model, Schema, model } from "mongoose";
import { AuthTypes } from "../types";

interface IAuthModel extends Model<AuthTypes.Auth> {}

const schema = new Schema<AuthTypes.Auth>(
  {
    token: { type: String, index: true, required: true, unique: true },
    userId: { type: String, index: true, required: true },
    expiration: { type: Number, index: true, required: true },
    createdAt: { type: Date, index: true, required: true },
  },
  { timestamps: true, collection: "Auth" }
);

const Auth: IAuthModel = model<AuthTypes.Auth, IAuthModel>("Auth", schema);

export default Auth;
