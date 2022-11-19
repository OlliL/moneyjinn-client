import { ErrorCode } from "@/model/ErrorCode";

const errorMessages = new Array();
errorMessages[ErrorCode.USERNAME_PASSWORD_WRONG] =
  "Der angegebene Benutzername oder das Passwort sind falsch!";
errorMessages[ErrorCode.ACCOUNT_IS_LOCKED] =
  "Ihr Benutzerkonto wurde gesperrt!";
errorMessages[ErrorCode.LOGGED_OUT] =
  "Zugriff verweigert! Sie sind nicht angemeldet!";

export function throwError(code: number) {
  throw new Error(errorMessages[code]);
}
