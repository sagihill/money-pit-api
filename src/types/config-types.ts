import { IEntityDetails } from ".";

export namespace ConfigTypes {
  export interface IConfigService {
    add(request: AddConfigRequest): Promise<void>;
    edit(request: EditConfigRequest): Promise<void>;

    get(key: string): Promise<string | undefined>;
    getNumber(key: string): Promise<number | undefined>;
    getBool(key: string): Promise<boolean | undefined>;
    getArray<T>(key: string): Promise<T[] | undefined>;
    getObject<T>(key: string): Promise<T | undefined>;
  }

  export interface IConfigRepository {
    add(request: AddConfigRequest): Promise<void>;
    edit(request: EditConfigRequest): Promise<void>;

    get(key: string): Promise<string | undefined>;
    getNumber(key: string): Promise<number | undefined>;
    getBool(key: string): Promise<boolean | undefined>;
    getArray<T>(key: string): Promise<T[] | undefined>;
    getObject<T>(key: string): Promise<T | undefined>;
  }

  export interface IConfig extends IEntityDetails {
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
}
