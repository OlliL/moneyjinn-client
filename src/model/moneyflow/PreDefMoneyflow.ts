export type PreDefMoneyflow = {
  id: number;
  userId: number;
  amount: number;
  capitalsourceId: number;
  capitalsourceComment: string;
  contractpartnerId: number;
  contractpartnerName: string;
  comment: string;
  createDate?: Date;
  onceAMonth: boolean;
  lastUsed?: Date;
  postingAccountId: number;
  postingAccountName: string;
};

export function preDefMoneyflowAlreadyUsedThisMonth(
  today: Date,
  preDefMoeyflow: PreDefMoneyflow
) {
  const lastUsedDate = preDefMoeyflow.lastUsed;
  return (
    preDefMoeyflow.onceAMonth &&
    lastUsedDate != null &&
    lastUsedDate.getMonth() === today.getMonth() &&
    lastUsedDate.getFullYear() == today.getFullYear()
  );
}
