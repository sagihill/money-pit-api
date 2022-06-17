import { Model, Schema, model } from "mongoose";
import { TechTypes } from "../types";

interface IMigrationModel extends Model<TechTypes.Migration> {}

const schema = new Schema<TechTypes.Migration>(
  {
    id: { type: String, index: true, required: true },
    name: { type: String, index: true, required: true },
    migratedAt: { type: Date, index: true, required: true },
  },
  { timestamps: true, collection: "Migration" }
);

const Migration: IMigrationModel = model<TechTypes.Migration, IMigrationModel>(
  "Migration",
  schema
);

export default Migration;
