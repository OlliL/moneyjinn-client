import I18nHolder from "@/handler/I18nHolder";

export const enum ErrorCode {
  CONTRACTPARTNER_DOES_NOT_EXIST = 2,
  CAPITALSOURCE_DOES_NOT_EXIST = 19,
  CAPITALSOURCE_STILL_REFERENCED = 120,
  CAPITALSOURCE_IN_USE_PERIOD = 121,
  CAPITALSOURCE_USE_OUT_OF_VALIDITY = 122,
  CAPITALSOURCE_IS_NOT_SET = 127,
  CONTRACTPARTNER_IS_NOT_SET = 128,
  BOOKINGDATE_IN_WRONG_FORMAT = 130,
  COMMENT_IS_NOT_SET = 131,
  USERNAME_PASSWORD_WRONG = 134,
  PASSWORD_NOT_MATCHING = 137,
  ACCOUNT_IS_LOCKED = 138,
  NO_SEARCH_CRITERIA_ENTERED = 141,
  USER_HAS_DATA = 151,
  PASSWORD_MUST_BE_CHANGED = 152,
  WRONG_FILE_FORMAT = 199,
  AMOUNT_ZERO = 200,
  NAME_ALREADY_EXISTS = 203,
  GROUP_IN_USE = 211,
  NAME_MUST_NOT_BE_EMPTY = 218,
  ACCOUNT_NUMBER_TO_LONG = 227,
  BANK_CODE_TO_LONG = 228,
  VALIDFROM_AFTER_VALIDTIL = 229,
  LOGGED_OUT = 231,
  POSTING_ACCOUNT_NOT_SPECIFIED = 234,
  CONTRACTPARTNER_NO_LONGER_VALID = 235,
  MONEYFLOWS_OUTSIDE_VALIDITY_PERIOD = 236,
  GROUP_WITH_SAME_NAME_ALREADY_EXISTS = 237,
  VALIDFROM_NOT_DEFINED = 238,
  USER_WITH_SAME_NAME_ALREADY_EXISTS = 240,
  GROUP_MUST_BE_SPECIFIED = 243,
  VALIDFROM_EARLIER_THAN_TOMORROW = 244,
  BOOKINGDATE_OUTSIDE_GROUP_ASSIGNMENT = 246,
  POSTINGACCOUNT_STILL_REFERENCED = 249,
  POSTINGACCOUNT_WITH_SAME_NAME_ALREADY_EXISTS = 250,
  ACCOUNT_NUMBER_CONTAINS_ILLEGAL_CHARS_OR_IS_EMPTY = 274,
  BANK_CODE_CONTAINS_ILLEGAL_CHARS_OR_IS_EMPTY = 275,
  ACCOUNT_NUMBER_CONTAINS_ILLEGAL_CHARS = 276,
  BANK_CODE_CONTAINS_ILLEGAL_CHARS = 277,
  // CAPITALSOURCE_IMPORT_NOT_ALLOWED = 283
  ACCOUNT_ALREADY_ASSIGNED_TO_OTHER_PARTNER = 286,
  CAPITALSOURCE_INVALID = 296,
  SPLIT_ENTRIES_AMOUNT_IS_NOT_EQUALS_MONEYFLOW_AMOUNT = 299,
  PIECES_NOT_SET = 343,
  NO_ETF_SPECIFIED = 344,
  AMOUNT_TO_HIGH = 353,
  PRICE_NOT_SET = 360,
  UNSUPPORTED_MEDIA_TYPE = 361,
  RECEIPT_ALREADY_EXISTS = 366,
  AMOUNT_TO_BIG = 376,
  MEDIA_TYPE_UNKNOWN = 379,
  AMOUNT_HAS_TO_BE_SPECIFIED = 380,
  MONEYFLOW_DOES_NOT_EXISTS = 381,
  YEAR_NOT_SET = 382,
  ETF_PRELIMINARY_LUMP_SUM_ALREADY_EXISTS = 383,
  ETF_PRELIMINARY_LUMP_SUM_DOES_NOT_EXIST = 384,
  ISIN_MUST_NOT_BE_EMPTY = 385,
  WKN_MUST_NOT_BE_EMPTY = 386,
  TICKER_MUST_NOT_BE_EMPTY = 387,
  ETF_STILL_REFERENCED = 388,
}

export const errorMessages = {
  [ErrorCode.CONTRACTPARTNER_DOES_NOT_EXIST]: I18nHolder.t()(
    "ErrorMessage.CONTRACTPARTNER_DOES_NOT_EXIST",
  ),
  [ErrorCode.CAPITALSOURCE_DOES_NOT_EXIST]: I18nHolder.t()(
    "ErrorMessage.CAPITALSOURCE_DOES_NOT_EXIST",
  ),
  [ErrorCode.CAPITALSOURCE_STILL_REFERENCED]: I18nHolder.t()(
    "ErrorMessage.CAPITALSOURCE_STILL_REFERENCED",
  ),
  [ErrorCode.CAPITALSOURCE_IN_USE_PERIOD]: I18nHolder.t()(
    "ErrorMessage.CAPITALSOURCE_IN_USE_PERIOD",
  ),
  [ErrorCode.CAPITALSOURCE_USE_OUT_OF_VALIDITY]: I18nHolder.t()(
    "ErrorMessage.CAPITALSOURCE_USE_OUT_OF_VALIDITY",
  ),
  [ErrorCode.CAPITALSOURCE_IS_NOT_SET]: I18nHolder.t()(
    "ErrorMessage.CAPITALSOURCE_IS_NOT_SET",
  ),
  [ErrorCode.CONTRACTPARTNER_IS_NOT_SET]: I18nHolder.t()(
    "ErrorMessage.CONTRACTPARTNER_IS_NOT_SET",
  ),
  [ErrorCode.BOOKINGDATE_IN_WRONG_FORMAT]: I18nHolder.t()(
    "ErrorMessage.BOOKINGDATE_IN_WRONG_FORMAT",
  ),
  [ErrorCode.COMMENT_IS_NOT_SET]: I18nHolder.t()(
    "ErrorMessage.COMMENT_IS_NOT_SET",
  ),
  [ErrorCode.USERNAME_PASSWORD_WRONG]: I18nHolder.t()(
    "ErrorMessage.USERNAME_PASSWORD_WRONG",
  ),
  [ErrorCode.PASSWORD_NOT_MATCHING]: I18nHolder.t()(
    "ErrorMessage.PASSWORD_NOT_MATCHING",
  ),
  [ErrorCode.ACCOUNT_IS_LOCKED]: I18nHolder.t()(
    "ErrorMessage.ACCOUNT_IS_LOCKED",
  ),
  [ErrorCode.PASSWORD_MUST_BE_CHANGED]: I18nHolder.t()(
    "ErrorMessage.PASSWORD_MUST_BE_CHANGED",
  ),
  [ErrorCode.NO_SEARCH_CRITERIA_ENTERED]: I18nHolder.t()(
    "ErrorMessage.NO_SEARCH_CRITERIA_ENTERED",
  ),
  [ErrorCode.USER_HAS_DATA]: I18nHolder.t()("ErrorMessage.USER_HAS_DATA"),
  [ErrorCode.WRONG_FILE_FORMAT]: I18nHolder.t()(
    "ErrorMessage.WRONG_FILE_FORMAT",
  ),
  [ErrorCode.AMOUNT_ZERO]: I18nHolder.t()("ErrorMessage.AMOUNT_ZERO"),
  [ErrorCode.NAME_ALREADY_EXISTS]: I18nHolder.t()(
    "ErrorMessage.NAME_ALREADY_EXISTS",
  ),
  [ErrorCode.GROUP_IN_USE]: I18nHolder.t()("ErrorMessage.GROUP_IN_USE"),
  [ErrorCode.NAME_MUST_NOT_BE_EMPTY]: I18nHolder.t()(
    "ErrorMessage.NAME_MUST_NOT_BE_EMPTY",
  ),
  [ErrorCode.ACCOUNT_NUMBER_TO_LONG]: I18nHolder.t()(
    "ErrorMessage.ACCOUNT_NUMBER_TO_LONG",
  ),
  [ErrorCode.BANK_CODE_TO_LONG]: I18nHolder.t()(
    "ErrorMessage.BANK_CODE_TO_LONG",
  ),
  [ErrorCode.VALIDFROM_AFTER_VALIDTIL]: I18nHolder.t()(
    "ErrorMessage.VALIDFROM_AFTER_VALIDTIL",
  ),
  [ErrorCode.LOGGED_OUT]: I18nHolder.t()("ErrorMessage.LOGGED_OUT"),
  [ErrorCode.POSTING_ACCOUNT_NOT_SPECIFIED]: I18nHolder.t()(
    "ErrorMessage.POSTING_ACCOUNT_NOT_SPECIFIED",
  ),
  [ErrorCode.CONTRACTPARTNER_NO_LONGER_VALID]: I18nHolder.t()(
    "ErrorMessage.CONTRACTPARTNER_NO_LONGER_VALID",
  ),
  [ErrorCode.MONEYFLOWS_OUTSIDE_VALIDITY_PERIOD]: I18nHolder.t()(
    "ErrorMessage.MONEYFLOWS_OUTSIDE_VALIDITY_PERIOD",
  ),
  [ErrorCode.GROUP_WITH_SAME_NAME_ALREADY_EXISTS]: I18nHolder.t()(
    "ErrorMessage.GROUP_WITH_SAME_NAME_ALREADY_EXISTS",
  ),
  [ErrorCode.VALIDFROM_NOT_DEFINED]: I18nHolder.t()(
    "ErrorMessage.VALIDFROM_NOT_DEFINED",
  ),
  [ErrorCode.USER_WITH_SAME_NAME_ALREADY_EXISTS]: I18nHolder.t()(
    "ErrorMessage.USER_WITH_SAME_NAME_ALREADY_EXISTS",
  ),
  [ErrorCode.GROUP_MUST_BE_SPECIFIED]: I18nHolder.t()(
    "ErrorMessage.GROUP_MUST_BE_SPECIFIED",
  ),
  [ErrorCode.VALIDFROM_EARLIER_THAN_TOMORROW]: I18nHolder.t()(
    "ErrorMessage.VALIDFROM_EARLIER_THAN_TOMORROW",
  ),
  [ErrorCode.BOOKINGDATE_OUTSIDE_GROUP_ASSIGNMENT]: I18nHolder.t()(
    "ErrorMessage.BOOKINGDATE_OUTSIDE_GROUP_ASSIGNMENT",
  ),
  [ErrorCode.POSTINGACCOUNT_STILL_REFERENCED]: I18nHolder.t()(
    "ErrorMessage.POSTINGACCOUNT_STILL_REFERENCED",
  ),
  [ErrorCode.POSTINGACCOUNT_WITH_SAME_NAME_ALREADY_EXISTS]: I18nHolder.t()(
    "ErrorMessage.POSTINGACCOUNT_WITH_SAME_NAME_ALREADY_EXISTS",
  ),
  [ErrorCode.ACCOUNT_NUMBER_CONTAINS_ILLEGAL_CHARS_OR_IS_EMPTY]: I18nHolder.t()(
    "ErrorMessage.ACCOUNT_NUMBER_CONTAINS_ILLEGAL_CHARS_OR_IS_EMPTY",
  ),
  [ErrorCode.BANK_CODE_CONTAINS_ILLEGAL_CHARS_OR_IS_EMPTY]: I18nHolder.t()(
    "ErrorMessage.BANK_CODE_CONTAINS_ILLEGAL_CHARS_OR_IS_EMPTY",
  ),
  [ErrorCode.ACCOUNT_NUMBER_CONTAINS_ILLEGAL_CHARS]: I18nHolder.t()(
    "ErrorMessage.ACCOUNT_NUMBER_CONTAINS_ILLEGAL_CHARS",
  ),
  [ErrorCode.BANK_CODE_CONTAINS_ILLEGAL_CHARS]: I18nHolder.t()(
    "ErrorMessage.BANK_CODE_CONTAINS_ILLEGAL_CHARS",
  ),
  // FIXME: variable content!
  [ErrorCode.ACCOUNT_ALREADY_ASSIGNED_TO_OTHER_PARTNER]: I18nHolder.t()(
    "ErrorMessage.ACCOUNT_ALREADY_ASSIGNED_TO_OTHER_PARTNER",
  ),
  [ErrorCode.CAPITALSOURCE_INVALID]: I18nHolder.t()(
    "ErrorMessage.CAPITALSOURCE_INVALID",
  ),
  [ErrorCode.SPLIT_ENTRIES_AMOUNT_IS_NOT_EQUALS_MONEYFLOW_AMOUNT]:
    I18nHolder.t()(
      "ErrorMessage.SPLIT_ENTRIES_AMOUNT_IS_NOT_EQUALS_MONEYFLOW_AMOUNT",
    ),
  [ErrorCode.PIECES_NOT_SET]: I18nHolder.t()("ErrorMessage.PIECES_NOT_SET"),
  [ErrorCode.NO_ETF_SPECIFIED]: I18nHolder.t()("ErrorMessage.NO_ETF_SPECIFIED"),
  [ErrorCode.AMOUNT_TO_HIGH]: I18nHolder.t()("ErrorMessage.AMOUNT_TO_HIGH"),
  [ErrorCode.PRICE_NOT_SET]: I18nHolder.t()("ErrorMessage.PRICE_NOT_SET"),
  [ErrorCode.UNSUPPORTED_MEDIA_TYPE]: I18nHolder.t()(
    "ErrorMessage.UNSUPPORTED_MEDIA_TYPE",
  ),
  [ErrorCode.RECEIPT_ALREADY_EXISTS]: I18nHolder.t()(
    "ErrorMessage.RECEIPT_ALREADY_EXISTS",
  ),
  [ErrorCode.AMOUNT_TO_BIG]: I18nHolder.t()("ErrorMessage.AMOUNT_TO_BIG"),
  [ErrorCode.MEDIA_TYPE_UNKNOWN]: I18nHolder.t()(
    "ErrorMessage.MEDIA_TYPE_UNKNOWN",
  ),
  [ErrorCode.AMOUNT_HAS_TO_BE_SPECIFIED]: I18nHolder.t()(
    "ErrorMessage.AMOUNT_HAS_TO_BE_SPECIFIED",
  ),
  [ErrorCode.MONEYFLOW_DOES_NOT_EXISTS]: I18nHolder.t()(
    "ErrorMessage.MONEYFLOW_DOES_NOT_EXISTS",
  ),

  [ErrorCode.YEAR_NOT_SET]: I18nHolder.t()("ErrorMessage.YEAR_NOT_SET"),
  [ErrorCode.ETF_PRELIMINARY_LUMP_SUM_ALREADY_EXISTS]: I18nHolder.t()(
    "ErrorMessage.ETF_PRELIMINARY_LUMP_SUM_ALREADY_EXISTS",
  ),
  [ErrorCode.ETF_PRELIMINARY_LUMP_SUM_DOES_NOT_EXIST]: I18nHolder.t()(
    "ErrorMessage.ETF_PRELIMINARY_LUMP_SUM_DOES_NOT_EXIST",
  ),
  [ErrorCode.ISIN_MUST_NOT_BE_EMPTY]: I18nHolder.t()(
    "ErrorMessage.ISIN_MUST_NOT_BE_EMPTY",
  ),
  [ErrorCode.WKN_MUST_NOT_BE_EMPTY]: I18nHolder.t()(
    "ErrorMessage.WKN_MUST_NOT_BE_EMPTY",
  ),
  [ErrorCode.TICKER_MUST_NOT_BE_EMPTY]: I18nHolder.t()(
    "ErrorMessage.TICKER_MUST_NOT_BE_EMPTY",
  ),
  [ErrorCode.ETF_STILL_REFERENCED]: I18nHolder.t()(
    "ErrorMessage.ETF_STILL_REFERENCED",
  ),
};

export function getErrorMessage(errorCode: number) {
  const message = errorMessages[errorCode as keyof typeof errorMessages];

  return message
    ? message
    : "Fehlertext zu Fehler-ID '" + errorCode + "' ist unbekannt!";
}
