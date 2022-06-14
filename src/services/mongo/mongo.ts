/* eslint-disable implicit-arrow-linebreak */
import util from "util";
import SafeMongooseConnection from "../../lib/safe-mongoose-connection";
import { LoggerTypes } from "../../types";
import { MongoTypes } from "../../types/mongo-types";

export class Mongo implements MongoTypes.IMongo {
  private safeConnetion: SafeMongooseConnection;

  constructor(private readonly logger: LoggerTypes.ILogger, mongoUrl: string) {
    let debugCallback;
    if (process.env.NODE_ENV === "development") {
      debugCallback = (
        collectionName: string,
        method: string,
        query: any,
        doc: string
      ): void => {
        const message = `${collectionName}.${method}(${util.inspect(query, {
          colors: true,
          depth: null,
        })})`;
        this.logger.log({
          level: "verbose",
          message,
          consoleLoggerOptions: { label: "MONGO" },
        });
      };
    }

    this.safeConnetion = new SafeMongooseConnection({
      mongoUrl: mongoUrl ?? "",
      debugCallback,
      onStartConnection: (mongoUrl) =>
        this.logger.info(`Connecting to MongoDB at ${mongoUrl}`),
      onConnectionError: (error, mongoUrl) =>
        this.logger.log({
          level: "error",
          message: `Could not connect to MongoDB at ${mongoUrl}`,
          error,
        }),
      onConnectionRetry: (mongoUrl) =>
        this.logger.info(`Retrying to MongoDB at ${mongoUrl}`),
    });
  }

  async connect(): Promise<void> {
    this.safeConnetion.connect((mongoUrl) => {
      this.logger.info(`Connected to MongoDB at ${mongoUrl}`);
    });
  }

  async disconnect(): Promise<void> {
    this.safeConnetion.close((err) => {
      if (err) {
        this.logger.log({
          level: "error",
          message: "Error shutting closing mongo connection",
          error: err,
        });
      } else {
        this.logger.info("Mongo connection closed successfully");
      }
      process.exit(0);
    }, true);
  }
}
