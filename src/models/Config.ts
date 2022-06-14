import { Model, Schema, model } from "mongoose";
import { ConfigTypes } from "../types";
import BaseEntitySchema from "./Base";

interface IConfigModel extends Model<ConfigTypes.IConfig> {}

const schema = new Schema<ConfigTypes.IConfig>(
  {
    id: { type: String, index: true, required: true, unique: true },
    key: { type: String, index: true, required: true, unique: true },
    value: { type: String, index: false, required: true },
    ...BaseEntitySchema,
  },
  { timestamps: true }
);

const Config: IConfigModel = model<ConfigTypes.IConfig, IConfigModel>(
  "Config",
  schema
);

export default Config;
