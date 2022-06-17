import * as UUID from "uuid";
import * as UUIDFromString from "uuid-by-string";
const uuidFromString = UUIDFromString.default;

export namespace ID {
  export function get(input?: string | undefined): string {
    if (!input) {
      return UUID.v4();
    }
    return uuidFromString(input as string) as string;
  }
}
