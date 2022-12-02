import ContractpartnerControllerHandler from "@/handler/ContractpartnerControllerHandler";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import { defineStore } from "pinia";

export const useContractpartnerStore = defineStore("contractpartner", {
  state: () => ({
    contractpartner: [] as Array<Contractpartner>,
  }),
  getters: {},
  actions: {
    async initContractpartnerStore() {
      if (this.contractpartner.length === 0) {
        const contractpartnerArray =
          await ContractpartnerControllerHandler.fetchAllContractpartner();
        this.contractpartner = contractpartnerArray;
        this.contractpartner.sort(this.compareContractpartnerByName);
      }
    },
    getValidContractpartner(validityDate: Date) {
      return this.contractpartner.filter((mcp) => {
        return validityDate >= mcp.validFrom && validityDate <= mcp.validTil;
      });
    },
    async addContractpartnerToStore(mcp: Contractpartner) {
      if (this.contractpartner.length > 0) {
        this.contractpartner.push(mcp);
        this.contractpartner.sort(this.compareContractpartnerByName);
      }
    },
    compareContractpartnerByName(
      a: Contractpartner,
      b: Contractpartner
    ): number {
      const al = a.name.toLowerCase();
      const bl = b.name.toLowerCase();
      return al === bl ? 0 : al > bl ? 1 : -1;
    },
  },
});
