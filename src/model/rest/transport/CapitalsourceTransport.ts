export type CapitalsourceTransport = {
  id: number;
  userid: number;
  type: number;
  state: number;
  accountNumber?: string;
  bankCode?: string;
  comment: string;
  validTil: string;
  validFrom: string;
  groupUse: number;
  importAllowed: number;
};
