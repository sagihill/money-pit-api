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
