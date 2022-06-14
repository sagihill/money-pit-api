export class CriticalError extends Error {
  constructor(
    msg: string,
    private readonly reason?: any,
    private readonly data?: any
  ) {
    super(msg);
  }
}

export class ValidationError extends Error {
  constructor(
    msg: string,
    private readonly reason?: any,
    private readonly data?: any
  ) {
    super(msg);
  }
}
