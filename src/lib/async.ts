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
