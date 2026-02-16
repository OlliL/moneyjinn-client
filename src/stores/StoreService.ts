import { useCapitalsourceStore } from "./CapitalsourceStore";
import { useContractpartnerStore } from "./ContractpartnerStore";
import { useEtfStore } from "./EtfStore";
import { usePostingAccountStore } from "./PostingAccountStore";

export class StoreService {
  private static instance: StoreService;
  private readonly contractpartnerStore = useContractpartnerStore();
  private readonly postingAccountStore = usePostingAccountStore();
  private readonly capitalsourceStore = useCapitalsourceStore();
  private readonly etfStore = useEtfStore();

  private constructor() {}

  public static getInstance(): StoreService {
    if (!StoreService.instance) {
      StoreService.instance = new StoreService();
    }
    return StoreService.instance;
  }

  public initAllStores() {
    const promiseContractpartner = this.initContractpartner();
    const promisePostingAccount = this.initPostingAccount();
    const promiseCapitalsource = this.initCapitalsource();
    const promiseEtf = this.initEtf();

    return Promise.all([
      promiseContractpartner,
      promisePostingAccount,
      promiseCapitalsource,
      promiseEtf,
    ]);
  }

  public subscribeAllStores() {
    this.subscribeContractpartner();
    this.subscribePostingAccount();
    this.subscribeCapitalsource();
    this.subscribeEtf();
  }

  private initContractpartner() {
    return this.contractpartnerStore.initContractpartnerStore();
  }

  private initPostingAccount() {
    return this.postingAccountStore.initPostingAccountStore();
  }

  private initCapitalsource() {
    return this.capitalsourceStore.initCapitalsourceStore();
  }

  private initEtf() {
    return this.etfStore.initEtfStore();
  }

  private subscribeContractpartner() {
    this.contractpartnerStore.subscribeToWebsocket();
  }

  private subscribePostingAccount() {
    this.postingAccountStore.subscribeToWebsocket();
  }

  private subscribeCapitalsource() {
    this.capitalsourceStore.subscribeToWebsocket();
  }

  private subscribeEtf() {
    this.etfStore.subscribeToWebsocket();
  }
}
