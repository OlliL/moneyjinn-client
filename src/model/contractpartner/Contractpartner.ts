export type Contractpartner = {
  id: number;
  userId: number;
  name: string;
  street?: string;
  postcode?: number;
  town?: string;
  validTil: Date;
  validFrom: Date;
  country?: string;
  moneyflowComment?: string;
  postingAccountName?: string;
  postingAccountId?: number;
};
