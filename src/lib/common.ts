import * as UUID from "uuid";
import * as UUIDFromString from "uuid-by-string";
import { ServicesProvider } from "../services/services-provider";
import { RequestHandler, Request, Response, NextFunction } from "express";
import { Masks } from "./masks";
import {
  AccountingTypes,
  AccountTypes,
  Currency,
  InvalidAmount,
  InvalidCurrency,
  InvalidDay,
  InvalidStringValue,
  RecurrentExpenseTypes,
  RequiredParameterError,
} from "../types";

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
      Number(dateParsed[0]),
      Number(dateParsed[1]) - 1,
      Number(dateParsed[2]) + 1
    );

    return date;
  }
}

export namespace Objects {
  /**
   * A mapping function for objects. Works just like Array.map(),
   * does deep recursive mapping.
   * @param o Input object.
   * @param cb A callback function which receives property name & value.
   * @param ctx Current context (object or array).
   */
  export function MapObject(
    o: any,
    cb: (pn: string, pv: any) => any,
    stack: any[] = [],
    depth?: { limit: number; current?: number }
  ) {
    let res = {} as any;

    let o1 = cb("", o);

    // This means the cb() has done something to o & no further processing is required.
    if (o1 !== o) {
      return o1;
    }

    let next: { limit: number; current?: number | undefined } | undefined;
    if (depth) {
      if ((depth.current || 0) > depth.limit) {
        return o;
      } else {
        next = { limit: depth.limit, current: (depth.current || 0) + 1 };
      }
    }

    // This is to prevent iterating over strings.
    if (typeof o === "object") {
      stack = [...stack, o];
      for (let pn in o) {
        let pv = o[pn];
        if (pv !== null || pv !== undefined) {
          if (Array.isArray(pv)) {
            // Arrays are mapped.
            res[pn] = pv.map((v) => MapObject(v, cb, [...stack, v], next));
          } else if (
            typeof pv === "object" &&
            ["ObjectId", "ObjectID", "Date"].includes(pv.constructor.name)
          ) {
            res[pn] = cb(pn, pv);
          } else if (pv instanceof Buffer) {
            // Buffers get processed by cb().
            res[pn] = cb(pn, pv);
          } else if (pv instanceof Error) {
            // Errors get processed by cb().
            res[pn] = cb(pn, pv);
          } else if (typeof pv === "object") {
            // Recursive structure check.
            if (stack.includes(pv)) {
              res[pn] = "RECURSION";
              continue;
            }

            // Object are mapped.
            res[pn] = MapObject(pv, cb, [...stack, pv], next);
          } else {
            // Regular props get processed by cb().
            res[pn] = cb(pn, pv);
          }

          if (res[pn] == undefined) {
            delete res[pn];
          }
        }
      }
    }

    // This means no processing happened & we should return o.
    // if (Object.getOwnPropertyNames(res).length === 0) {
    //   res = o;
    // }

    return res;
  }

  export function Sanitize(object: any, santizeConfig: string[]): any {
    return MapObject(object, (k: string, v: any) => {
      v = v || "";
      k = k || "";

      if (!k || v instanceof Function) {
        return v;
      }

      let format = (v: any, mask: string) => {
        switch (mask) {
          case "all":
            return Masks.MaskAll(v);
          case "part":
            return Masks.MaskPartially(v);
          default:
            return undefined;
        }
      };

      let sanitizer = (v: any) => {
        let sanitized = v;
        for (let config of santizeConfig) {
          const [key, mask] = config.split(",");
          const regex = new RegExp(`${key}`);
          if (k.match(regex)) {
            sanitized = format(v, mask);
            break;
          }
        }

        return sanitized;
      };

      return sanitizer(v);
    });
  }
}

export namespace Validate {
  export function isValidAmount(amount?: number): boolean {
    return (
      !Number.isNaN(amount) &&
      Number.isInteger(amount) &&
      Number.isFinite(amount)
    );
  }

  export function expenseCategory(category?: AccountingTypes.ExpenseCategory) {
    if (
      category &&
      !Object.values(AccountingTypes.ExpenseCategory).includes(
        category as AccountingTypes.ExpenseCategory
      )
    ) {
      throw new AccountingTypes.InvalidExpenseCategory(
        category as AccountingTypes.ExpenseCategory
      );
    }

    return {
      required: () => required(category, "category"),
    };
  }

  export function expenseType(type?: AccountingTypes.ExpenseType) {
    if (
      type &&
      !Object.values(AccountingTypes.ExpenseType).includes(
        type as AccountingTypes.ExpenseType
      )
    ) {
      throw new AccountingTypes.InvalidExpenseType(
        type as AccountingTypes.ExpenseType
      );
    }

    return {
      required: () => required(type, "expense type"),
    };
  }

  export function currency(currency?: Currency) {
    if (currency && !Object.values(Currency).includes(currency)) {
      throw new InvalidCurrency(currency);
    }

    return {
      required: () => required(currency, "currency"),
    };
  }

  export function day(day?: number) {
    if (
      day &&
      (Number.isNaN(day) ||
        !Number.isInteger(day) ||
        !Number.isFinite(day) ||
        day <= 0 ||
        day > 31)
    ) {
      throw new InvalidDay(day);
    }

    return {
      required: () => required(day, "day"),
    };
  }

  export function expenseRecurrence(
    recurrence?: RecurrentExpenseTypes.Recurrence
  ) {
    if (
      recurrence &&
      !Object.values(RecurrentExpenseTypes.Recurrence).includes(recurrence)
    ) {
      throw new RecurrentExpenseTypes.InvalidRecurrence(recurrence);
    }

    return {
      required: () => required(recurrence, "expense recurrence"),
    };
  }

  export function amount(amount?: number) {
    if (amount && !isValidAmount(amount)) {
      throw new InvalidAmount(amount);
    }

    return {
      required: () => required(amount, "amount"),
    };
  }

  export function string(fieldName: string, str?: string) {
    if (str && typeof str !== "string") {
      throw new InvalidStringValue(str, fieldName);
    }

    return {
      required: () => required(str, fieldName),
    };
  }

  export function accountType(type?: AccountTypes.AccountType) {
    if (type && !Object.values(AccountTypes.AccountType).includes(type)) {
      throw new AccountTypes.InvalidAccountType(type);
    }

    return {
      required: () => required(type, "account type"),
    };
  }

  export function required(value: any, fieldName: string) {
    if (!value) {
      throw new RequiredParameterError(fieldName);
    }
  }
}
