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

  export function setTimeoutExtended(callback: Function, delay: number) {
    var maxDelay = Math.pow(2, 31) - 1;

    if (delay > maxDelay) {
      var args = arguments;
      args[1] -= maxDelay;

      return setTimeout(function () {
        setTimeoutExtended.apply(undefined, args as any);
      }, maxDelay);
    }

    return setTimeout.apply(undefined, arguments as any);
  }
}
export namespace Dates {
  export function toDate(dateString: string, format: string): Date {
    const dateParsed = dateString.split("-");

    const date = new Date(
      Number(dateParsed[2]),
      Number(dateParsed[1]) - 1,
      Number(dateParsed[0]) + 1
    );

    return date;
  }
}
