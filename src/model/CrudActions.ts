import type { InjectionKey } from "vue";
import type { Capitalsource } from "./capitalsource/Capitalsource";
import type { Contractpartner } from "./contractpartner/Contractpartner";
import type { ContractpartnerAccount } from "./contractpartneraccount/ContractpartnerAccount";
import type { ContractpartnerMatching } from "./contractpartnermatching/ContractpartnerMatching";
import type { Etf } from "./etf/Etf";
import type { EtfFlow } from "./etf/EtfFlow";
import type { Group } from "./group/Group";
import type { ImportedMoneyflowReceipt } from "./moneyflow/ImportedMoneyflowReceipt";
import type { Moneyflow } from "./moneyflow/Moneyflow";
import type { PreDefMoneyflow } from "./moneyflow/PreDefMoneyflow";
import type { PostingAccount } from "./postingaccount/PostingAccount";
import type { User } from "./user/User";

export interface CrudActions<T> {
  create: () => void;
  edit: (item: T) => void;
  delete: (item: T) => void;
}

export type LocalCrudModalActions<T> = CrudActions<T>;

export type OpenContractpartnerAccountsAction = (item: Contractpartner) => void;

export interface MonthlySettlementModalActions {
  create: () => void;
  edit: () => void;
  delete: () => void;
}

export const CapitalsourceActionsKey: InjectionKey<
  LocalCrudModalActions<Capitalsource>
> = Symbol("CapitalsourceActions");

export const ContractpartnerActionsKey: InjectionKey<
  LocalCrudModalActions<Contractpartner>
> = Symbol("ContractpartnerActions");

export const OpenContractpartnerAccountsActionKey: InjectionKey<OpenContractpartnerAccountsAction> =
  Symbol("OpenContractpartnerAccountsAction");

export const ContractpartnerAccountActionsKey: InjectionKey<
  LocalCrudModalActions<ContractpartnerAccount>
> = Symbol("ContractpartnerAccountActions");

export const PostingAccountActionsKey: InjectionKey<
  LocalCrudModalActions<PostingAccount>
> = Symbol("PostingAccountActions");

export const UserActionsKey: InjectionKey<LocalCrudModalActions<User>> =
  Symbol("UserActions");

export const GroupActionsKey: InjectionKey<LocalCrudModalActions<Group>> =
  Symbol("GroupActions");

export const EtfActionsKey: InjectionKey<LocalCrudModalActions<Etf>> =
  Symbol("EtfActions");

export const EtfFlowActionsKey: InjectionKey<LocalCrudModalActions<EtfFlow>> =
  Symbol("EtfFlowActions");

export const PreDefMoneyflowActionsKey: InjectionKey<
  LocalCrudModalActions<PreDefMoneyflow>
> = Symbol("PreDefMoneyflowActions");

export const ContractpartnerMatchingActionsKey: InjectionKey<
  LocalCrudModalActions<ContractpartnerMatching>
> = Symbol("ContractpartnerMatchingActions");

export const MonthlySettlementModalActionsKey: InjectionKey<MonthlySettlementModalActions> =
  Symbol("MonthlySettlementModalActions");

export interface CompareDataActions {
  create: (mmf: Moneyflow) => void;
  edit: (id: number) => Promise<void>;
  delete: (id: number) => Promise<void>;
}
export const CompareDataActionsKey: InjectionKey<CompareDataActions> =
  Symbol("CompareDataActions");

export interface MoneyflowRowActions {
  list: (mmf: Moneyflow) => void;
  edit: (mmf: Moneyflow) => void;
  delete: (mmf: Moneyflow) => void;
  receipt: (id: number) => void;
}
export const MoneyflowRowActionsKey: InjectionKey<MoneyflowRowActions> = Symbol(
  "MoneyflowRowActions",
);

export interface ImportReceiptRowActions {
  list: (id: number, receipt: ImportedMoneyflowReceipt) => void;
  edit: (id: number, receipt: ImportedMoneyflowReceipt) => void;
  delete: (id: number) => void;
  removeReceipt: (id: number) => void;
}
export const ImportReceiptRowActionsKey: InjectionKey<ImportReceiptRowActions> =
  Symbol("ImportReceiptRowActions");
