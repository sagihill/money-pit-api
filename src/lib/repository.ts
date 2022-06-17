import { Model } from "mongoose";
import { MongoTypes } from "../types";
import { Objects } from "../lib";

/**
 * A generic base class for Mongo-backed repositories.
 */
export class MongoRepository<T, U> implements MongoTypes.Repository<T, U> {
  constructor(protected readonly model: Model<T>) {
    // /
  }

  async add(data: T): Promise<T> {
    const modelInstance = new this.model(data);
    const doc = await modelInstance.save();
    return this.deserialize(doc.toObject());
  }

  async addMany(data: T[]): Promise<T[]> {
    const modelInstance = new this.model(data);
    const result = await modelInstance.collection.insertMany(data);
    const docs: T[] = [];
    if (result.insertedCount) {
      for await (const doc of data) {
        docs.push(this.deserialize(doc));
      }
    }
    return docs;
  }

  async updateOne(qry: any, editRequest: U): Promise<boolean> {
    const res = await this.model.updateOne(
      { qry },
      { ...editRequest, updatedAt: new Date() }
    );

    return res.modifiedCount === 1;
  }

  async update(id: string, editRequest: U): Promise<boolean> {
    const res = await this.model.updateOne(
      { id },
      { ...editRequest, updatedAt: new Date() }
    );

    return res.modifiedCount === 1;
  }

  async remove(id: string): Promise<boolean> {
    const res = await this.model.updateOne(
      { id },
      { deleted: true, updatedAt: new Date() }
    );

    return res.modifiedCount === 1;
  }

  /**
   * Performs a find query.
   * @param qry A MongoDB query object.
   * @param sortObj A MongoDB sort object.
   * @param limit Max number of objects for cursor to retrieve
   */
  async find(qry: any, sortObj?: any, limit?: number): Promise<T[]> {
    const query = sortObj
      ? this.model.find({ ...qry, deleted: false }).sort(sortObj)
      : this.model.find({ ...qry, deleted: false });

    if (limit) query.limit(limit);

    const a = await (await query).map((v) => this.deserialize(v.toObject()));
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

  async removeMany(qry: any): Promise<number> {
    const result = await this.model.updateMany(qry, {
      $set: { deleted: true, updatedAt: new Date() },
    });

    return result.modifiedCount;
  }

  async removeOne(qry: any): Promise<boolean> {
    const result = await this.model.updateOne(qry, {
      $set: { deleted: true, updatedAt: new Date() },
    });

    return result.modifiedCount === 1;
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
    const deserialized = Objects.Sanitize(src, [
      "deleted",
      "_id",
      "__v",
      "updatedAt",
      "createdAt",
    ]);
    return { ...deserialized } as T;
  }
}
