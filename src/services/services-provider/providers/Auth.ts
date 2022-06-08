import { AuthTypes } from "../../../types";
import { AuthService, getAuthRepository } from "../../auth";
import { ServicesProvider } from "../services-provider";

export default async function Auth(
  options: any,
  SP: ServicesProvider
): Promise<AuthTypes.IAuthService> {
  const logger = await SP.Logger();
  const user = await SP.User();
  const repository = getAuthRepository();
  const auth = new AuthService(user, repository, logger);
  return auth;
}
