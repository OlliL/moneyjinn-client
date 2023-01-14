import { ErrorCode } from "@/model/ErrorCode";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import type { Ref } from "vue";

export function throwError(code: number) {
  throw new Error(getError(code));
}

// TODO export can be removed after everything is migrated to composition API and vee-validate
export function getError(code: number, variableArray?: Array<string>) {
  switch (code) {
    case ErrorCode.CONTRACTPARTNER_DOES_NOT_EXIST: {
      return "Der gewählte Vertragspartner existiert nicht!";
    }
    case ErrorCode.CAPITALSOURCE_DOES_NOT_EXIST: {
      return "Die gewählte Kapitalquelle existiert nicht!";
    }
    case ErrorCode.CAPITALSOURCE_IN_USE_PERIOD: {
      return "Es existieren Geldbewegungen für diese Kapitalquelle ausserhalb des gwählten Gültigkeitszeitraums";
    }
    case ErrorCode.CAPITALSOURCE_USE_OUT_OF_VALIDITY: {
      return "Das Buchungsdatum liegt nicht im Gültigkeitszeitraum der gewählten Kapitalquelle!";
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
    case ErrorCode.PASSWORD_NOT_MATCHING: {
      return "Passwort falsch!";
    }
    case ErrorCode.ACCOUNT_IS_LOCKED: {
      return "Ihr Benutzerkonto wurde gesperrt!";
    }
    case ErrorCode.PASSWORD_MUST_BE_CHANGED: {
      return "Sie müssen ihr Passwort ändern!";
    }
    case ErrorCode.NO_SEARCH_CRITERIA_ENTERED: {
      return "Keine Suchkriterien angegeben!";
    }
    case ErrorCode.WRONG_FILE_FORMAT: {
      return "Die angegebene Datei konnte nicht geparsed werden! Eventuell haben Sie eine falsche Datei oder das falsche Format angegeben?";
    }
    case ErrorCode.AMOUNT_ZERO: {
      return "Der Betrag muss ungleich 0 sein!";
    }
    case ErrorCode.NAME_ALREADY_EXISTS: {
      return "Der Name existiert bereits!";
    }
    case ErrorCode.GROUP_IN_USE: {
      return "Eine Gruppe darf nicht gelöscht werden, solange Benutzer dieser Gruppe zugewiesen sind oder waren!";
    }
    case ErrorCode.ACCOUNT_NUMBER_TO_LONG: {
      return "Die IBAN darf nicht mehr als 34 Stellen haben!";
    }
    case ErrorCode.BANK_CODE_TO_LONG: {
      return "Die BIC darf nicht mehr als 11 Stellen haben!";
    }
    case ErrorCode.VALIDFROM_AFTER_VALIDTIL: {
      return 'Das Datum im Feld "gültig von" muss vor dem Datum des Feldes "gültig bis" liegen!';
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
    case ErrorCode.ACCOUNT_NUMBER_CONTAINS_ILLEGAL_CHARS_OR_IS_EMPTY: {
      return "Die IBAN darf nicht leer sein und darf nur aus Buchstaben und Ziffern bestehen!";
    }
    case ErrorCode.BANK_CODE_CONTAINS_ILLEGAL_CHARS_OR_IS_EMPTY: {
      return "Die BIC darf nicht leer sein und darf nur aus Buchstaben und Ziffern bestehen!";
    }
    case ErrorCode.ACCOUNT_NUMBER_CONTAINS_ILLEGAL_CHARS: {
      return "Die IBAN darf nur aus Buchstaben und Ziffern bestehen!";
    }
    case ErrorCode.BANK_CODE_CONTAINS_ILLEGAL_CHARS: {
      return "Die BIC darf nur aus Buchstaben und Ziffern bestehen!";
    }
    case ErrorCode.ACCOUNT_ALREADY_ASSIGNED_TO_OTHER_PARTNER: {
      const contractpartnerName = variableArray ? variableArray[0] : "";
      return (
        "Das von Ihnen angegebene Vertragspartnerkonto ist bereits dem Vertragspartner " +
        contractpartnerName +
        " zugeordnet!"
      );
    }
    case ErrorCode.CAPITALSOURCE_INVALID: {
      return "Kapitalquelle darf nicht verwendet werden!";
    }
    case ErrorCode.SPLIT_ENTRIES_AMOUNT_IS_NOT_EQUALS_MONEYFLOW_AMOUNT: {
      return "Die Summe der Beträge der Unterbuchungen entspricht nicht dem Betrag der Hauptbuchung!";
    }
    case ErrorCode.PIECES_NOT_SET: {
      return "Bitte Menge angeben!";
    }
    case ErrorCode.NO_ETF_SPECIFIED: {
      return "Bitte einen ETF auswählen!";
    }
    case ErrorCode.AMOUNT_TO_HIGH: {
      return "Mehr Stück angegeben als verfügbar!";
    }
    case ErrorCode.PRICE_NOT_SET: {
      return "Bitte Stückpreis angeben!";
    }
    case ErrorCode.UNSUPPORTED_MEDIA_TYPE: {
      return "Bitte nur JPEG oder PDF Dokumente hochladen!";
    }
    case ErrorCode.RECEIPT_ALREADY_EXISTS: {
      return "Die ausgewählte Geldbewegung verfügt bereits über einen Bon!";
    }
    case ErrorCode.AMOUNT_TO_BIG: {
      return "Betrag zu groß!";
    }
    case ErrorCode.MEDIA_TYPE_UNKNOWN: {
      return "Unbekannter Medientyp!";
    }
    case ErrorCode.AMOUNT_HAS_TO_BE_SPECIFIED: {
      return "Es muss ein Betrag angegeben werden!";
    }
    default: {
      return "Fehlertext zu Fehler-ID '" + code + "' ist unbekannt!";
    }
  }
}

export function handleServerError(
  validationResult: ValidationResult,
  serverErrors: Ref<Array<string>>
): boolean {
  if (!validationResult.result) {
    serverErrors.value = new Array<string>();
    for (const resultItem of validationResult.validationResultItems) {
      serverErrors.value.push(getError(resultItem.error));
    }
  }
  return !validationResult.result;
}
