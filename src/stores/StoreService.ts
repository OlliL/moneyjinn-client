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
    this.initContractpartner();
    this.initPostingAccount();
    this.initCapitalsource();
  }

  public subscribeAllStores() {
    this.subscribeContractpartner();
  }

  private initContractpartner() {
    this.contractpartnerStore.initContractpartnerStore();
  }

  private initPostingAccount() {
    this.postingAccountStore.initPostingAccountStore();
  }

  private initCapitalsource() {
    this.capitalsourceStore.initCapitalsourceStore();
  }

  private subscribeContractpartner() {
    this.contractpartnerStore.subscribeToWebsocket();
  }
}
