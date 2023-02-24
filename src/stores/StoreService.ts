import { useCapitalsourceStore } from "./CapitalsourceStore";
import { useContractpartnerStore } from "./ContractpartnerStore";
import { usePostingAccountStore } from "./PostingAccountStore";

export class StoreService {
  private static instance: StoreService;
  private contractpartnerStore = useContractpartnerStore();
  private postingAccountStore = usePostingAccountStore();
  private capitalsourceStore = useCapitalsourceStore();

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

    return Promise.all([
      promiseContractpartner,
      promisePostingAccount,
      promiseCapitalsource,
    ]);
  }

  public subscribeAllStores() {
    this.subscribeContractpartner();
    this.subscribePostingAccount();
    this.subscribeCapitalsource();
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

  private subscribeContractpartner() {
    this.contractpartnerStore.subscribeToWebsocket();
  }

  private subscribePostingAccount() {
    this.postingAccountStore.subscribeToWebsocket();
  }

  private subscribeCapitalsource() {
    this.capitalsourceStore.subscribeToWebsocket();
  }
}
