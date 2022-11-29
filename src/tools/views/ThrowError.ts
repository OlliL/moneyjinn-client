import { ErrorCode } from "@/model/ErrorCode";

export function throwError(code: number) {
  throw new Error(getError(code));
}

export function getError(code: number) {
  switch (code) {
    case ErrorCode.CONTRACTPARTNER_DOES_NOT_EXIST: {
      return "Der gewählte Vertragspartner existiert nicht!";
    }
    case ErrorCode.CAPITALSOURCE_DOES_NOT_EXIST: {
      return "Die gewählte Kapitalquelle existiert nicht!";
    }
    case ErrorCode.CAPITALSOURCE_USE_OUT_OF_VALIDITY: {
      return "Es existieren Geldbewegungen für diese Kapitalquelle ausserhalb des gwählten Gültigkeitszeitraums!";
    }
    case ErrorCode.CAPITALSOURCE_IS_NOT_SET: {
      return "Eine Kapitalquelle muss angegeben werden!";
    }
    case ErrorCode.CONTRACTPARTNER_IS_NOT_SET: {
      return "Ein Vertragspartner muss angegeben werden!";
    }
    case ErrorCode.BOOKINGDATE_IN_WRONG_FORMAT: {
      return "Das Buchungsdatum muss ein gültiges Datum sein";
    }
    case ErrorCode.COMMENT_IS_NOT_SET: {
      return "Ein Kommentar muss angegeben werden!";
    }
    case ErrorCode.USERNAME_PASSWORD_WRONG: {
      return "Der angegebene Benutzername oder das Passwort sind falsch!";
    }
    case ErrorCode.ACCOUNT_IS_LOCKED: {
      return "Ihr Benutzerkonto wurde gesperrt!";
    }
    case ErrorCode.AMOUNT_ZERO: {
      return "Der Betrag muss ungleich 0 sein!";
    }
    case ErrorCode.LOGGED_OUT: {
      return "Zugriff verweigert! Sie sind nicht angemeldet!";
    }
    case ErrorCode.POSTING_ACCOUNT_NOT_SPECIFIED: {
      return "Ein Buchungskonto muss angegeben werden!";
    }
    case ErrorCode.CONTRACTPARTNER_NO_LONGER_VALID: {
      return "Der ausgewählte Vertragspartner ist zum gewählten Datum nicht mehr gültig!";
    }
    case ErrorCode.BOOKINGDATE_OUTSIDE_GROUP_ASSIGNMENT: {
      return "Sie können keine Geldbewegung zu einem Datum anlegen, an dem Sie in einer anderen Gruppe als Ihrer aktuellen sind!";
    }
    case ErrorCode.POSTINGACCOUNT_WITH_SAME_NAME_ALREADY_EXISTS: {
      return "Es existiert bereits ein Buchungskonto mit diesem Namen!";
    }
    case ErrorCode.CAPITALSOURCE_INVALID: {
      return "Kapitalquelle darf nicht verwendet werden!";
    }
    case ErrorCode.SPLIT_ENTRIES_AMOUNT_IS_NOT_EQUALS_MONEYFLOW_AMOUNT: {
      return "Die Summe der Beträge der Unterbuchungen entspricht nicht dem Betrag der Hauptbuchung!";
    }
    case ErrorCode.AMOUNT_TO_BIG: {
      return "Betrag zu groß!";
    }
    default: {
      return "Fehlertext zu Fehler-ID '" + code + "' ist unbekannt!";
    }
  }
}
