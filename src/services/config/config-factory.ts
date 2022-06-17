import { ID } from "../../lib";
import { ConfigTypes } from "../../types";

export async function createNewConfig(
  request: ConfigTypes.AddConfigRequest
): Promise<ConfigTypes.ConfigDetails> {
  const now = new Date();
  const details: ConfigTypes.ConfigDetails = {
    ...request,
    id: ID.get(),
    deleted: false,
    createdAt: now,
    updatedAt: now,
  };

  return details;
}
