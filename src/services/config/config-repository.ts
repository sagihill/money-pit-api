import { ConfigTypes } from "../../types";
import { Model } from "mongoose";
import Config from "../../models/Config";

/* eslint-disable import/first */
import dotenv from "dotenv";
import * as path from "path";
import { ID } from "../../lib/common";

export const getConfigRepository = () => {
  return new ConfigRepository(Config);
};

class ConfigRepository implements ConfigTypes.IConfigRepository {
  constructor(private readonly ConfigModel: Model<ConfigTypes.IConfig>) {
    const result = dotenv.config({
      path: path.join(__dirname + "../../../../.env"),
    });
    if (result.error) {
      dotenv.config({
        path: path.join(__dirname + "../../../../.env.default"),
      });
    }
  }

  async add(request: ConfigTypes.AddConfigRequest): Promise<void> {
    const exists = !!(await this.getValue(request.key));
    if (exists) {
      throw new Error("Configuration allready exists.");
    }
    const now = new Date();
    const details: ConfigTypes.ConfigDetails = {
      ...request,
      id: ID.get(),
      deleted: false,
      createdAt: now,
      updatedAt: now,
    };
    const modelInstance = new this.ConfigModel(details);
    await modelInstance.save();
  }

  async edit(request: ConfigTypes.EditConfigRequest): Promise<void> {
    const exists = !!(await this.getValue(request.key));
    if (!exists) {
      throw new Error("Configuration doesn't exists.");
    }

    const now = new Date();

    await this.ConfigModel.updateOne(
      { key: request.key },
      {
        $set: {
          value: request.value,
          deleted: request.deleted,
          updatedAt: now,
        },
      }
    );
  }

  async get(key: string): Promise<string | undefined> {
    const value = await this.getValue(key);
    return value;
  }

  async getNumber(key: string): Promise<number | undefined> {
    const value = await this.getValue(key);
    if (value) {
      const num = Number(value);
      if (num != NaN) {
        return num;
      }
    }
  }

  async getBool(key: string): Promise<boolean | undefined> {
    const value = await this.getValue(key);
    if (value) {
      let bool;
      if (value === "true") {
        bool = true;
      } else if (value === "false") {
        bool = false;
      }
      return bool;
    }
  }

  //TODO: this needs a real implementation
  async getArray<T>(key: string): Promise<T[] | undefined> {
    const value = await this.getValue(key);
    const array = JSON.stringify(value);
    if (typeof array === "object") {
      return array;
    }
  }

  async getObject<T>(key: string): Promise<T | undefined> {
    const value = await this.getValue(key);
    let object;
    if (value) {
      object = JSON.parse(value);
    }
    if (typeof object === "object") {
      return object as T;
    }
  }

  private async getValue(key: string): Promise<string | undefined> {
    if (!!process.env[key]) {
      return process.env[key];
    }

    const doc = await this.ConfigModel.findOne({ key });
    const object = doc?.toObject();
    return object?.value;
  }
}
