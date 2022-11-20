//FIXME: bookingdate, invoicedate --> Date
//FIXME: private --> boolean
export type Moneyflow = {
  id: number;
  userid: number;
  bookingdate: string;
  invoicedate: string;
  amount: number;
  capitalsourceid: number;
  capitalsourcecomment: string;
  contractpartnerid: number;
  contractpartnername: string;
  comment: string;
  private: number;
  postingaccountid: number;
  postingaccountname: string;
};
