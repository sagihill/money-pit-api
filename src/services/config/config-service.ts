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
    } catch (error: any) {
      this.logger.error(`Can't add config`);
      throw error;
    }
  }
  async edit(request: ConfigTypes.EditConfigRequest): Promise<void> {
    try {
      this.logger.info(`edit config`);
      return await this.configRepository.edit(request);
    } catch (error: any) {
      this.logger.error(`Can't edit config`);
      throw error;
    }
  }

  async addMapEntry(
    request: ConfigTypes.ConfigureMapEntryRequest
  ): Promise<void> {
    try {
      this.logger.info(`add map entry`);
      return await this.configRepository.addMapEntry(request);
    } catch (error: any) {
      this.logger.error(`Can't add map entry`);
      throw error;
    }
  }

  async editMapEntry(
    request: ConfigTypes.ConfigureMapEntryRequest
  ): Promise<void> {
    try {
      this.logger.info(`edit map entry`);
      return await this.configRepository.editMapEntry(request);
    } catch (error: any) {
      this.logger.error(`Can't edit map entry`);
      throw error;
    }
  }
  async removeMapEntry(
    request: ConfigTypes.removeMapEntryRequest
  ): Promise<void> {
    try {
      this.logger.info(`remove map entry`);
      return await this.configRepository.removeMapEntry(request);
    } catch (error: any) {
      this.logger.error(`Can't remove map entry`);
      throw error;
    }
  }

  async refresh(): Promise<void> {
    try {
      await this.configRepository.refresh();
    } catch (error: any) {
      this.logger.error(`Can't refresh configs`);
      throw error;
    }
  }

  async get(key: string): Promise<string> {
    try {
      return (await this.configRepository.get(key)) as string;
    } catch (error: any) {
      this.logger.error(`Can't get config of key: ${key}`);
      throw error;
    }
  }
  async getNumber(key: string): Promise<number> {
    try {
      return (await this.configRepository.getNumber(key)) as number;
    } catch (error: any) {
      this.logger.error(`Can't get config of key: ${key}`);
      throw error;
    }
  }
  async getBool(key: string): Promise<boolean> {
    try {
      return (await this.configRepository.getBool(key)) as boolean;
    } catch (error: any) {
      this.logger.error(`Can't get config of key: ${key}`);
      throw error;
    }
  }
  async getArray<T>(key: string): Promise<T[]> {
    try {
      return (await this.configRepository.getArray<T>(key)) as T[];
    } catch (error: any) {
      this.logger.error(`Can't get config of key: ${key}`);
      throw error;
    }
  }
  async getObject<T>(key: string): Promise<T> {
    try {
      return (await this.configRepository.getObject<T>(key)) as T;
    } catch (error: any) {
      this.logger.error(`Can't get config of key: ${key}`);
      throw error;
    }
  }
}
