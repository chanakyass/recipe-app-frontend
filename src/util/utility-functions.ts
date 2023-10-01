import * as moment from "moment";

export function equalsIgnoringCase(text: string, other: string) {
  return text.localeCompare(other, undefined, { sensitivity: "base" }) === 0;
}

export function convertStringToCapitalCamelCase(word: string) {
  if (word) {
    if (word.length === 1) {
      return word.toUpperCase();
    } else {
      return word
        .split(" ")
        .filter((str) => str !== '')
        .map(
          (str) =>
            str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase()
        )
        .join(" ")
        .trim();
    }
  }
  return word;
}

export const convertDateToReadableFormat = (itemUTCString: string) => {
  if (itemUTCString) {
    if (!itemUTCString.match(/Z$/gi)) {
      itemUTCString += "Z";
    } 
    return moment(itemUTCString).local().format("DD-MM-yyyy HH:mm");
  }
  return "Not provided";
};

function debounce(): Function {
  let timer: NodeJS.Timeout;
  return function (fn: Function, delay: number, ...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

export const debounced = debounce();
