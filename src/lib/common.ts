import * as UUID from "uuid";
import * as UUIDFromString from "uuid-by-string";

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
