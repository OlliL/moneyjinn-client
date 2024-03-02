/**
 * Pinia uses per default JSON.parse as deserializer.
 * Unfortunally Date gets serialized as UTC timezoned string.
 * JSON.parse just restores it as string which renders it useless because the code working with the affected properties treats them as Date objects.
 *
 * JSON.parse can also receive a reviver which can be used to parse those UTC timezoned date strings and finally dezerializes them as propper Date objects.
 *
 * For safety this function only handles the keys validFrom and validTil for now.
 *
 * @param key The key associated with the value.
 * @param value The value produced by parsing.
 * @returns Date(value) or value
 */
const dateTimeReviver = function (key: string, value: string) {
  if (typeof value === "string" && (key === "validFrom" || key == "validTil")) {
    return new Date(value);
  }
  return value;
};

export function jsonParseWithDate(value: string) {
  return JSON.parse(value, dateTimeReviver);
}
