import { Masks } from "./masks";

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
        // eslint-disable-next-line no-else-return
      } else {
        next = { limit: depth.limit, current: (depth.current || 0) + 1 };
      }
    }

    // This is to prevent iterating over strings.
    if (typeof o === "object") {
      stack = [...stack, o];
      for (let pn in o) {
        // eslint-disable-next-line prefer-const
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
    if (Object.getOwnPropertyNames(res).length === 0) {
      res = o;
    }

    return res;
  }

  export function Sanitize(object: any, santizeConfig: string[]): any {
    return MapObject(object, (k: string, v: any) => {
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
