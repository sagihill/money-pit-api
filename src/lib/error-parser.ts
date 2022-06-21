import { TechnicalError } from "../errors/service-error";
import { DomainTypes, LoggerTypes, MongoTypes } from "../types";
import { MongoUtils } from "./mongo";
import { MongoServerError } from "mongodb";

/**
 * An error parser for simple service
 */
export class ErrorParser implements DomainTypes.ISimpleErrorParser {
  constructor(protected readonly logger: LoggerTypes.ILogger) {
    // /
  }

  /**
   *
   * @param error
   * @throws Error
   */
  async parse(error: Error): Promise<Error> {
    try {
      this.logger.debug(`Parsing error ${error}`);
      let err = error;
      switch (error.name) {
        case "MongoServerError":
          err = this.parseMongoServerError(error as MongoServerError);
          break;
        default:
          err = error;
          break;
      }

      return err;
    } catch (error: any) {
      this.logger.debug(`Error on error parser`);
      return new TechnicalError();
    }
  }

  private parseMongoServerError(error: MongoServerError): Error {
    switch (error.code) {
      case 11000:
        const fields = Object.keys(error.keyValue);
        return new DomainTypes.NonUniqueError(fields);
      default:
        return new TechnicalError();
    }
  }
}
