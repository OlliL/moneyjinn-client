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
    getContractpartnerForLetter(
      letter: string,
      validNow?: boolean
    ): Array<Contractpartner> {
      let mcs = this.contractpartner;
      if (validNow) {
        mcs = this.getValidContractpartner(new Date());
      }

      if (letter === "") {
        return mcs;
      }
      return mcs.filter(
        (entry) => entry.name.substring(0, 1).toUpperCase() === letter
      );
    },
    async getContractpartnerLetters(
      validNow?: boolean
    ): Promise<Array<string>> {
      await this.initContractpartnerStore();
      let mcs = this.contractpartner;
      if (validNow) {
        mcs = this.getValidContractpartner(new Date());
      }
      const letters = mcs.map((entry) =>
        entry.name.substring(0, 1).toUpperCase()
      );
      const uniqueLetters = letters
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort();
      return uniqueLetters;
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
    },
    deleteContractpartner(mcs: Contractpartner) {
      this.contractpartner = this.contractpartner.filter(
        (originalMcs) => mcs.id !== originalMcs.id
      );
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
