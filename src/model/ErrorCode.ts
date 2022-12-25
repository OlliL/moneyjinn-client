export const enum ErrorCode {
  CONTRACTPARTNER_DOES_NOT_EXIST = 2,
  CAPITALSOURCE_DOES_NOT_EXIST = 19,
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
  WRONG_FILE_FORMAT = 199,
  AMOUNT_ZERO = 200,
  NAME_ALREADY_EXISTS = 203,
  ACCOUNT_NUMBER_TO_LONG = 227,
  BANK_CODE_TO_LONG = 228,
  VALIDFROM_AFTER_VALIDTIL = 229,
  LOGGED_OUT = 231,
  POSTING_ACCOUNT_NOT_SPECIFIED = 234,
  CONTRACTPARTNER_NO_LONGER_VALID = 235,
  BOOKINGDATE_OUTSIDE_GROUP_ASSIGNMENT = 246,
  POSTINGACCOUNT_WITH_SAME_NAME_ALREADY_EXISTS = 250,
  ACCOUNT_NUMBER_CONTAINS_ILLEGAL_CHARS_OR_IS_EMPTY = 274,
  BANK_CODE_CONTAINS_ILLEGAL_CHARS_OR_IS_EMPTY = 275,
  ACCOUNT_NUMBER_CONTAINS_ILLEGAL_CHARS = 276,
  BANK_CODE_CONTAINS_ILLEGAL_CHARS = 277,
  ACCOUNT_ALREADY_ASSIGNED_TO_OTHER_PARTNER = 286,
  CAPITALSOURCE_INVALID = 296,
  SPLIT_ENTRIES_AMOUNT_IS_NOT_EQUALS_MONEYFLOW_AMOUNT = 299,
  PIECES_NOT_SET = 343,
  NO_ETF_SPECIFIED = 343,
  AMOUNT_TO_HIGH = 353,
  PRICE_NOT_SET = 360,
  UNSUPPORTED_MEDIA_TYPE = 361,
  RECEIPT_ALREADY_EXISTS = 366,
  AMOUNT_TO_BIG = 376,
  MEDIA_TYPE_UNKNOWN = 379,
  AMOUNT_HAS_TO_BE_SPECIFIED = 380,
}
