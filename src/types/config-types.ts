import { DomainTypes } from ".";

export namespace ConfigTypes {
  export interface IConfigService {
    add(request: AddConfigRequest): Promise<void>;
    edit(request: EditConfigRequest): Promise<void>;
    addMapEntry(request: ConfigureMapEntryRequest): Promise<void>;
    editMapEntry(request: ConfigureMapEntryRequest): Promise<void>;
    removeMapEntry(request: removeMapEntryRequest): Promise<void>;
    refresh(): Promise<void>;

    get(key: string): Promise<string>;
    getNumber(key: string): Promise<number>;
    getBool(key: string): Promise<boolean>;
    getArray<T>(key: string): Promise<T[]>;
    getObject<T>(key: string): Promise<T>;
  }

  export interface IConfigRepository {
    add(request: AddConfigRequest): Promise<void>;
    edit(request: EditConfigRequest): Promise<void>;
    addMapEntry(request: ConfigureMapEntryRequest): Promise<void>;
    editMapEntry(request: ConfigureMapEntryRequest): Promise<void>;
    removeMapEntry(request: removeMapEntryRequest): Promise<void>;
    refresh(): Promise<void>;

    get(key: string): Promise<string | undefined>;
    getNumber(key: string): Promise<number | undefined>;
    getBool(key: string): Promise<boolean | undefined>;
    getArray<T>(key: string): Promise<T[] | undefined>;
    getObject<T>(key: string): Promise<T | undefined>;
  }

  export interface IConfig extends DomainTypes.IEntityDetails {
    id: string;
    key: string;
    value: string;
  }

  export type AddConfigRequest = {
    key: string;
    value: string;
  };

  export type EditConfigRequest = {
    key: string;
    value: string;
    deleted: boolean;
  };

  export type ConfigDetails = {
    id: string;
    key: string;
    value: string;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
  };

  export type ConfigureMapEntryRequest = {
    mapName: string;
    mapEntry: { key: string; value: string };
  };
  export type removeMapEntryRequest = {
    mapName: string;
    mapEntry: { key: string };
  };
}
