import { UserTypes } from "../../../types";
import { getUserRepository, UserService } from "../../user";
import { ServicesProvider } from "../services-provider";

export default async function User(
  options: any,
  SP: ServicesProvider
): Promise<UserTypes.IUserService> {
  const logger = await SP.Logger();
  const repository = getUserRepository();
  const userService = new UserService(repository, logger);
  return userService;
}
