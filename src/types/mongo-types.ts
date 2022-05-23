export namespace MongoTypes {
  export interface IMongo {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
  }

  export interface Repository<T, E> {
    find(qry: any, sortObj?: any, limit?: number): Promise<T[]>;
    deleteMany(qry: any): Promise<void>;
    add(data: T): Promise<T>;
    edit(id: string, editRequest: E): Promise<void>;
    get(id: string): Promise<T | undefined>;
    remove(id: string): Promise<void>;
    serialize(data: T): any;
    deserialize(data: any): T;
  }
}
