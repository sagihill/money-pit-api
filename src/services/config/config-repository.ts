import { ConfigTypes } from "../../types";
import { Model } from "mongoose";
import Config from "../../models/Config";

/* eslint-disable import/first */
import dotenv from "dotenv";
import * as path from "path";
import { createNewConfig } from "./config-factory";

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
    const exists = !!(await this.getValueFromDBOnly(request.key));
    if (exists) {
      throw new Error("Configuration allready exists.");
    }
    const details: ConfigTypes.ConfigDetails = await createNewConfig(request);
    const modelInstance = new this.ConfigModel(details);
    await modelInstance.save();
  }

  async addMany(requests: ConfigTypes.AddConfigRequest[]): Promise<void> {
    const data = [];

    for await (const request of requests) {
      const config = await createNewConfig(request);
      data.push(config);
    }

    const modelInstance = new this.ConfigModel(data);
    await modelInstance.collection.insertMany(data);
  }

  async edit(request: ConfigTypes.EditConfigRequest): Promise<void> {
    const exists = !!(await this.getValueFromDBOnly(request.key));
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

  async addMapEntry(
    request: ConfigTypes.ConfigureMapEntryRequest
  ): Promise<void> {
    const value = (await this.getObject(request.mapName)) as any;
    const exists = !!value;
    if (!exists) {
      throw new Error("Configuration doesn't exists.");
    }

    if (!!value[request.mapEntry.key]) {
      throw new Error("Map entry allready exists, try to edit it.");
    }

    value[request.mapEntry.key] = request.mapEntry.value;

    const now = new Date();

    await this.ConfigModel.updateOne(
      { key: request.mapName },
      {
        $set: {
          value: JSON.stringify(value),
          updatedAt: now,
        },
      }
    );
  }

  async editMapEntry(
    request: ConfigTypes.ConfigureMapEntryRequest
  ): Promise<void> {
    const value = (await this.getObject(request.mapName)) as any;
    const exists = !!value;
    if (!exists) {
      throw new Error("Configuration doesn't exists.");
    }

    if (!value[request.mapEntry.key]) {
      throw new Error("Map entry doesn't exists, try to add it.");
    }

    value[request.mapEntry.key] = request.mapEntry.value;

    const now = new Date();

    await this.ConfigModel.updateOne(
      { key: request.mapName },
      {
        $set: {
          value: JSON.stringify(value),
          updatedAt: now,
        },
      }
    );
  }

  async removeMapEntry(
    request: ConfigTypes.removeMapEntryRequest
  ): Promise<void> {
    const value = (await this.getObject(request.mapName)) as any;
    const exists = !!value;
    if (!exists) {
      throw new Error("Configuration doesn't exists.");
    }

    if (!value[request.mapEntry.key]) {
      throw new Error("Map entry doesn't exists, can't remove it.");
    }

    delete value[request.mapEntry.key];

    const now = new Date();

    await this.ConfigModel.updateOne(
      { key: request.mapName },
      {
        $set: {
          value: JSON.stringify(value),
          updatedAt: now,
        },
      }
    );
  }

  private mapEntryValidation(value: any): void {}

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

  private async getValueFromDBOnly(key: string): Promise<string | undefined> {
    const doc = await this.ConfigModel.findOne({ key });
    const object = doc?.toObject();
    return object?.value;
  }

  async refresh(): Promise<void> {
    const docs = await this.ConfigModel.find({});
    docs.forEach((doc) => {
      const object = doc?.toObject();
      process.env[object.key] = object.value;
    });
  }
}
