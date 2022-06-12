import {
  IEntityDetails,
  ISimpleService,
  LoggerTypes,
  MongoTypes,
} from "../types";

/**
 * A generic base class for Service repositories.
 */
export abstract class SimpleService<T, A, U>
  implements ISimpleService<T, A, U>
{
  constructor(
    protected readonly repository: MongoTypes.Repository<T, U>,
    protected readonly logger: LoggerTypes.ILogger
  ) {
    ///
  }

  async add(request: A): Promise<T> {
    try {
      this.logger.info(`Running create on ${this.constructor.name}`);
      await this.createValidation(request);
      const details = await this.createEntityDetails(request);
      return await this.repository.add(details);
    } catch (error) {
      this.logger.error(`Error on create function of ${this.constructor.name}`);
      throw error;
    }
  }

  async update(id: string, request: U): Promise<void> {
    try {
      this.logger.info(`Running update on ${this.constructor.name}`);
      await this.updateValidation(id, request);
      await this.repository.update(id, request);
    } catch (error) {
      this.logger.error(`Error on update function of ${this.constructor.name}`);
      throw error;
    }
  }
  async remove(id: string): Promise<void> {
    try {
      this.logger.info(`Running remove on ${this.constructor.name}`);
      await this.repository.remove(id);
    } catch (error) {
      this.logger.error(`Error on remove function of ${this.constructor.name}`);
      throw error;
    }
  }
  async get(id: string): Promise<T | undefined> {
    try {
      this.logger.info(`Running remove on ${this.constructor.name}`);
      const result = await this.repository.get(id);
      return result;
    } catch (error) {
      this.logger.error(`Error on get function of ${this.constructor.name}`);
      throw error;
    }
  }

  abstract createValidation(request: A): Promise<void>;

  abstract updateValidation(id: string, request: U): Promise<void>;

  abstract createEntityDetails(request: A): Promise<T>;

  protected async getBaseEntityDetails(): Promise<IEntityDetails> {
    const now = new Date();
    return {
      deleted: false,
      createdAt: now,
      updatedAt: now,
    };
  }
}
