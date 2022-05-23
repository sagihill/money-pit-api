import { MongoTypes } from "../types";
import { Model } from "mongoose";

/**
 * A generic base class for Mongo-backed repositories.
 */
export class MongoRepository<T, E> implements MongoTypes.Repository<T, E> {
  constructor(private readonly model: Model<T>) {
    ///
  }

  async add(data: T): Promise<T> {
    const modelInstance = new this.model(data);
    const doc = await modelInstance.save();
    return this.deserialize(doc.toObject());
  }

  async edit(id: string, editRequest: E): Promise<void> {
    await this.model.findOneAndUpdate(
      { id },
      { ...editRequest, updatedAt: new Date() }
    );
  }

  async remove(id: string): Promise<void> {
    await this.model.findOneAndUpdate(
      { id },
      { deleted: true, updatedAt: new Date() }
    );
  }

  /**
   * Performs a find query.
   * @param qry A MongoDB query object.
   * @param sortObj A MongoDB sort object.
   * @param limit Max number of objects for cursor to retrieve
   */
  async find(qry: any, sortObj?: any, limit?: number): Promise<T[]> {
    let query = sortObj
      ? this.model.find({ ...qry, deleted: false }).sort(sortObj)
      : this.model.find({ ...qry, deleted: false });

    if (limit) query.limit(limit);

    let a = await (await query).map((v) => this.deserialize(v));
    return a;
  }

  /**
   * Returns a single instance by its id.
   * @param id uuid.
   */
  async get(id: string): Promise<T | undefined> {
    const doc = await this.model.findOne({ id, deleted: false });
    if (doc) {
      return this.deserialize(doc.toObject());
    }
  }

  async deleteMany(qry: any): Promise<void> {
    await this.model.updateMany(qry, {
      $set: { deleted: true, updatedAt: new Date() },
    });
  }

  /**
   * Serializes domain types for storing them in the DB.
   * @param src Domain object to serialize.
   */
  serialize(src: T): any {
    return { ...src };
  }

  /**
   * Deserializes a DB record into a domain type.
   * @param src A record object coming from the DB.
   */
  deserialize(src: any): T {
    delete src.deleted;
    delete src._id;
    delete src.__v;
    return { ...src } as T;
  }
}
