import * as UUID from "uuid";
import * as UUIDFromString from "uuid-by-string";
import { ServicesProvider } from "../services/services-provider";
import { RequestHandler, Request, Response, NextFunction } from "express";

const uuidFromString = UUIDFromString.default;

// tslint:disable-next-line: no-namespace
export namespace Sync {
  export function sleep(ms: number): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }
}

export namespace ID {
  export function get(input?: string | undefined): string {
    if (!input) {
      return UUID.v4();
    } else {
      return uuidFromString(input as string) as string;
    }
  }
}

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

  export function getTokenFromRequest(req: Request): string | undefined {
    return req?.headers?.authorization?.split(" ")[1];
  }
}

export namespace Async {
  export function IIFE(callback: Function) {
    (async () => {
      try {
        await callback();
      } catch (e) {
        console.log(e);
      }
    })();
  }
}

