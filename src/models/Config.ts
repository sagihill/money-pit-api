import { Model, Schema, model } from "mongoose";
import { ConfigTypes } from "../types";

interface IConfigModel extends Model<ConfigTypes.IConfig> {}

const schema = new Schema<ConfigTypes.IConfig>(
  {
    id: { type: String, index: true, required: true, unique: true },
    key: { type: String, index: true, required: true, unique: true },
    value: { type: String, index: false, required: true },
    deleted: { type: Boolean, index: true, required: true },
    createdAt: { type: Date, index: true, required: true },
    updatedAt: { type: Date, index: true, required: true },
  },
  { timestamps: true }
);

const Config: IConfigModel = model<ConfigTypes.IConfig, IConfigModel>(
  "Config",
  schema
);

export default Config;
