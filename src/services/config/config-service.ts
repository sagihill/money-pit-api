import { ConfigTypes, LoggerTypes } from "../../types";

export class ConfigService implements ConfigTypes.IConfigService {
  constructor(
    private readonly configRepository: ConfigTypes.IConfigRepository,
    private readonly logger: LoggerTypes.ILogger
  ) {}

  async add(request: ConfigTypes.AddConfigRequest): Promise<void> {
    try {
      this.logger.info(`add config`);
      return await this.configRepository.add(request);
    } catch (error) {
      this.logger.error(`Can't add config`);
      throw error;
    }
  }
  async edit(request: ConfigTypes.EditConfigRequest): Promise<void> {
    try {
      this.logger.info(`edit config`);
      return await this.configRepository.edit(request);
    } catch (error) {
      this.logger.error(`Can't edit config`);
      throw error;
    }
  }

  async get(key: string): Promise<string | undefined> {
    try {
      return await this.configRepository.get(key);
    } catch (error) {
      this.logger.error(`Can't get config of key: ${key}`);
      throw error;
    }
  }
  async getNumber(key: string): Promise<number | undefined> {
    try {
      return await this.configRepository.getNumber(key);
    } catch (error) {
      this.logger.error(`Can't get config of key: ${key}`);
      throw error;
    }
  }
  async getBool(key: string): Promise<boolean | undefined> {
    try {
      return await this.configRepository.getBool(key);
    } catch (error) {
      this.logger.error(`Can't get config of key: ${key}`);
      throw error;
    }
  }
  async getArray<T>(key: string): Promise<T[] | undefined> {
    try {
      return await this.configRepository.getArray<T>(key);
    } catch (error) {
      this.logger.error(`Can't get config of key: ${key}`);
      throw error;
    }
  }
  async getObject(key: string): Promise<object | undefined> {
    try {
      return await this.configRepository.getObject(key);
    } catch (error) {
      this.logger.error(`Can't get config of key: ${key}`);
      throw error;
    }
  }
}
