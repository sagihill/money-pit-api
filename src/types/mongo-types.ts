export namespace MongoTypes {
  export interface IMongo {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
  }
}
