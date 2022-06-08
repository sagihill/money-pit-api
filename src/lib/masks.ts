/**
 * String and numbers Masks.
 */
export namespace Masks {
  /**
   * Masks an entire string with asterisks.
   */
  export function MaskAll(s: string) {
    if (typeof s != "string") {
      return s;
    }
    return s.replace(/./g, "*");
  }

  /**
   * Masks a token string with asterisks leaving only few first & last symbols.
   */
  export function MaskPartially(s: string) {
    if (typeof s != "string") {
      return s;
    }

    let a = Math.floor(s.length / 3),
      b = s.length - a;
    return s.substr(0, a) + MaskAll(s.substr(a, b - a)) + s.substr(b);
  }
}
