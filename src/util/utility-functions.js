import moment from "moment";
export function equalsIgnoringCase(text, other) {
  return text.localeCompare(other, undefined, { sensitivity: "base" }) === 0;
}

export function convertStringToCapitalCamelCase(word) {
  if (word) {
    if (word.length === 1) {
      return word.toUpperCase();
    } else {
      return word
        .split(" ")
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

export const convertDateToReadableFormat = (itemUTCString) => {
  if (itemUTCString) {
    if (!itemUTCString.match(/Z$/gi)) {
      itemUTCString += "Z";
    }
      
      return moment(itemUTCString).local().format("DD-MM-yyyy HH:mm");
  }
  return "Not provided";
};

function debounce() {
  let timer;
  return function (fn, delay, ...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

export const debounced = debounce();
