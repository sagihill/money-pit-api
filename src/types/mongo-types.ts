import { CriticalError } from "../errors/service-error";

export namespace MongoTypes {
  export interface IMongo {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
  }

  export interface Repository<T, U> {
    find(qry: any, sortObj?: any, limit?: number): Promise<T[]>;
    removeMany(qry: any): Promise<number>;
    add(data: T): Promise<T>;
    addMany(data: T[]): Promise<T[]>;
    update(id: string, editRequest: U): Promise<boolean>;
    updateOne(qry: any, editRequest: U): Promise<boolean>;
    get(id: string): Promise<T | undefined>;
    remove(id: string): Promise<boolean>;
    removeOne(qry: any): Promise<boolean>;
    serialize(data: T): any;
    deserialize(data: any): T;
  }

  export class EntityRemoveError extends CriticalError {
    constructor(private readonly id: string) {
      super(`Entity of id ${id} wasn't removed. couldn't perform operation.`);
    }
  }
  export class EntityUpdateError extends CriticalError {
    constructor(private readonly id: string) {
      super(`Entity of id ${id} wasn't updated. couldn't perform operation.`);
    }
  }
}
