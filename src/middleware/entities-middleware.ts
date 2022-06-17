export namespace Middleware {
  export class UsingMiddleware<T, O> {
    protected mw: IMiddleware<T, O>[] = [];

    use(middleware: IMiddleware<T, O>) {
      this.mw.push(middleware);
    }

    runMiddleware(entity: T, options?: O): T {
      let intEntity = entity;
      this.mw.forEach((mw) => {
        intEntity = mw(intEntity, options);
      });
      return intEntity;
    }
  }

  export type IMiddleware<T, O> = (entity: T, options?: O) => T;
}
