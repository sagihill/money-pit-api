import { Request } from "express";
import { ServicesProvider } from "../services/services-provider";

export namespace Utils {
  export async function getUserIdFromRequest(req: Request): Promise<string> {
    const SP = ServicesProvider.get();
    const authService = await SP.Auth();
    const userService = await SP.User();
    const token = getTokenFromRequest(req);
    if (!token) {
      throw new Error("token is missing");
    }

    const auth = await authService.getAuth(token);

    const user = await userService.get(auth.userId);

    if (!user) {
      throw new Error("Can't get user from token");
    }

    return user.id;
  }

  export async function validateAccountMembership(
    req: Request,
    accountId: string
  ): Promise<void> {
    const SP = ServicesProvider.get();
    const userId = await getUserIdFromRequest(req);
    const validationService = await SP.Validation();
    await validationService.validateAccountMembership(userId, accountId);
  }

  export async function validateAccountOwnership(
    req: Request,
    accountId: string
  ): Promise<void> {
    const SP = ServicesProvider.get();
    const userId = await getUserIdFromRequest(req);
    const validationService = await SP.Validation();
    await validationService.validateAccountOwnership(userId, accountId);
  }
  export async function validateEntityOwnership(
    req: Request,
    accountId: string
  ): Promise<void> {
    const SP = ServicesProvider.get();
    const userId = await getUserIdFromRequest(req);
    const validationService = await SP.Validation();
    await validationService.validateAccountOwnership(userId, accountId);
  }

  export function getTokenFromRequest(req: Request): string | undefined {
    return req?.headers?.authorization?.split(" ")[1];
  }

  export const searchMap = (string: string, map: { [key: string]: string }) => {
    let category;
    Object.entries(map).forEach((entry) => {
      if (string.includes(entry[0])) {
        category = entry[1];
      }
    });

    return category;
  };
}
