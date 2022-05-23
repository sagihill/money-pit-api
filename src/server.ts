/* eslint-disable import/first */
import dotenv from "dotenv";

const result = dotenv.config();
if (result.error) {
  dotenv.config({ path: ".env.default" });
}

import app from "./app";
import { ServicesProvider } from "./services/services-provider";

const PORT = process.env.PORT || 3000;
const SP = ServicesProvider.get();

const serve = async () => {
  const logger = await SP.Logger();
  return app.listen(PORT, () => {
    logger.info(`🌏 Express server started at http://localhost:${PORT}`);

    if (process.env.NODE_ENV === "development") {
      // This route is only present in development mode
      logger.info(
        `⚙️  Swagger UI hosted at http://localhost:${PORT}/dev/api-docs`
      );
    }
  });
};

(async () => {
  try {
    const logger = await SP.Logger();
    if (process.env.MONGO_URL == null) {
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
  } catch (e) {
    console.log(e);
  }
})();

// Close the Mongoose connection, when receiving SIGINT
process.on("SIGINT", () => {
  (async () => {
    try {
      const logger = await SP.Logger();
      console.log("\n"); /* eslint-disable-line */
      logger.info("Gracefully shutting down");
      logger.info("Closing the MongoDB connection");
      const mongo = await SP.Mongo();
      await mongo.disconnect();
    } catch (e) {
      console.log(e);
    }
  })();
});
