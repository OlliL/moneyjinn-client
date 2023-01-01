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
    async searchContractpartner(
      comment: String,
      validNow?: boolean
    ): Promise<Array<Contractpartner>> {
      await this.initContractpartnerStore();

      let mcp = this.contractpartner;
      if (validNow) {
        mcp = this.getValidContractpartner(new Date());
      }

      if (comment === "") {
        return mcp;
      }

      const commentUpper = comment.toUpperCase();
      return mcp.filter((entry) =>
        entry.name.toUpperCase().includes(commentUpper)
      );
    },
    async addContractpartnerToStore(mcp: Contractpartner) {
      if (this.contractpartner.length > 0) {
        this.contractpartner.push(mcp);
        this.contractpartner.sort(this.compareContractpartnerByName);
      }
    },
    updateContractpartnerInStore(mcs: Contractpartner) {
      const pos = this.contractpartner.findIndex(
        (entry) => entry.id === mcs.id
      );
      if (pos !== undefined) this.contractpartner.splice(pos, 1, mcs);
      this.contractpartner.sort(this.compareContractpartnerByName);
    },
    deleteContractpartner(mcs: Contractpartner) {
      this.contractpartner = this.contractpartner.filter(
        (originalMcs) => mcs.id !== originalMcs.id
      );
    },
    getContractpartner(id: number): Contractpartner | undefined {
      return this.contractpartner.find((entry) => entry.id === id);
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
