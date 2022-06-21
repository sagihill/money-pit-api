export namespace MongoUtils {
  export function isMongoUniquenessError(error: Error): boolean {
    return (
      error.name === "MongoServerError" &&
      error.message.includes("duplicate key error")
    );
  }
}
