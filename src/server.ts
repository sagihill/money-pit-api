/* eslint-disable import/first */
import app from "./app";
import { Async } from "./lib/common";
import { ServicesProvider } from "./services/services-provider";
import { ConfigTypes } from "./types";

const SP = ServicesProvider.get();
let config: ConfigTypes.IConfigService;

Async.IIFE(async () => {
  config = await SP.Config();
});

Async.IIFE(async () => {
  const logger = await SP.Logger();
  const config = await SP.Config();
  const mongoUrl = await config.get("MONGO_URL");
  if (mongoUrl == null) {
    logger.error(
      "MONGO_URL not specified in environment",
      new Error("MONGO_URL not specified in environment")
    );
    process.exit(1);
  } else {
    const mongo = await SP.Mongo();
    await mongo.connect();
    await serve();
  }
});

const serve = async () => {
  const logger = await SP.Logger();
  const PORT = (await config.get("PORT")) || 3000;
  const Task = await SP.Task();
  // await Task.run();

  return app.listen(PORT, async () => {
    logger.info(`🌏 Express server started at http://localhost:${PORT}`);

    if ((await config.get("NODE_ENV")) === "development") {
      // This route is only present in development mode
      logger.info(
        `⚙️  Swagger UI hosted at http://localhost:${PORT}/dev/api-docs`
      );
    }
  });
};

// Close the Mongoose connection, when receiving SIGINT
process.on("SIGINT", () => {
  Async.IIFE(async () => {
    const logger = await SP.Logger();
    console.log("\n"); /* eslint-disable-line */
    logger.info("Gracefully shutting down");
    logger.info("Closing the MongoDB connection");
    const mongo = await SP.Mongo();
    await mongo.disconnect();
  });
});
