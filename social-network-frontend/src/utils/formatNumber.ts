import { replace } from "lodash";
import numeral from "numeral";

export function fCurrency(number: number) {
  return numeral(number).format(Number.isInteger(number) ? "$0,0" : "$0,0.00");
}

export function fPercent(number: number) {
  return numeral(number / 100).format("0.0%");
}

export function fNumber(number: number) {
  return numeral(number).format();
}

export function fShortenNumber(number: number) {
  return replace(numeral(number).format("0.00a"), ".00", "");
}

export function fData(number: number) {
  return numeral(number).format("0.0 b");
}

export function fChangeToMB(number: number) {
  // display bytes or KB or MB
  if (number < 1024) {
    return number + " bytes";
  } else if (number < 1048576) {
    return (number / 1024).toFixed(2) + " KB";
  } else {
    return (number / 1048576).toFixed(2) + " MB";
  }
}
