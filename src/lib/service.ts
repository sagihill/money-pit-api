import { DomainTypes, LoggerTypes, MongoTypes } from "../types";
import { ErrorParser } from "./error-parser";

/**
 * A generic base class for Service repositories.
 */
export abstract class SimpleService<T, A, U>
  implements
    DomainTypes.ISimpleService<T, A, U>,
    DomainTypes.IAccountSimpleService<T, A, U>
{
  protected errorParser: ErrorParser;
  constructor(
    protected readonly repository: MongoTypes.Repository<T, U>,
    protected readonly logger: LoggerTypes.ILogger
  ) {
    this.errorParser = new ErrorParser(logger);
  }

  async add(request: A): Promise<T> {
    try {
      this.logger.info(`Running create on ${this.constructor.name}`);
      await this.createValidation(request);
      const details = await this.createEntityDetails(request);
      return await this.repository.add(details);
    } catch (error: any) {
      this.logger.error(`Error on create function of ${this.constructor.name}`);
      throw await this.errorParser.parse(error);
    }
  }

  async get(id: string): Promise<T | undefined> {
    try {
      this.logger.info(`Running get on ${this.constructor.name}`);
      const result = await this.repository.get(id);
      return result;
    } catch (error: any) {
      this.logger.error(`Error on get function of ${this.constructor.name}`);
      throw await this.errorParser.parse(error);
    }
  }

  async update(id: string, request: U): Promise<void> {
    try {
      this.logger.info(`Running update on ${this.constructor.name}`);
      await this.updateValidation(id, request);
      const res = await this.repository.update(id, request);
      if (!res) {
        throw new MongoTypes.EntityRemoveError(id);
      }
    } catch (error: any) {
      this.logger.error(`Error on update function of ${this.constructor.name}`);
      throw await this.errorParser.parse(error);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      this.logger.info(`Running remove on ${this.constructor.name}`);
      const res = await this.repository.remove(id);
      if (!res) {
        throw new MongoTypes.EntityRemoveError(id);
      }
    } catch (error: any) {
      this.logger.error(`Error on remove function of ${this.constructor.name}`);
      throw await this.errorParser.parse(error);
    }
  }

  async findAccountOne(id: string, accountId: string): Promise<T | undefined> {
    try {
      this.logger.info(`Running findAccountOne on ${this.constructor.name}`);
      const result = (await this.repository.find({ id, accountId }, {}, 1))[0];
      return result;
    } catch (error: any) {
      this.logger.error(
        `Error on findAccountOne function of ${this.constructor.name}`
      );
      throw await this.errorParser.parse(error);
    }
  }

  async updateAccountOne(
    id: string,
    accountId: string,
    request: U
  ): Promise<void> {
    try {
      this.logger.info(`Running updateAccountOne on ${this.constructor.name}`);
      await this.updateValidation(id, request);
      const res = await this.repository.updateOne({ id, accountId }, request);
      if (!res) {
        throw new MongoTypes.EntityUpdateError(id);
      }
    } catch (error: any) {
      this.logger.error(
        `Error on updateAccountOne function of ${this.constructor.name}`
      );
      throw await this.errorParser.parse(error);
    }
  }

  async removeAccountOne(id: string, accountId: string): Promise<void> {
    try {
      this.logger.info(`Running removeAccountOne on ${this.constructor.name}`);
      const res = await this.repository.removeOne({ id, accountId });
      if (!res) {
        throw new MongoTypes.EntityRemoveError(id);
      }
    } catch (error: any) {
      this.logger.error(
        `Error on removeAccountOne function of ${this.constructor.name}`
      );
      throw await this.errorParser.parse(error);
    }
  }

  abstract createValidation(request: A): Promise<void>;

  abstract updateValidation(id: string, request: U): Promise<void>;

  abstract createEntityDetails(request: A): Promise<T>;

  protected async getBaseEntityDetails(): Promise<DomainTypes.IEntityDetails> {
    const now = new Date();
    return {
      deleted: false,
      createdAt: now,
      updatedAt: now,
    };
  }
}
