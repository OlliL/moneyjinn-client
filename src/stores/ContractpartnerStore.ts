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
    locationOf(
      element: Contractpartner,
      array: Array<Contractpartner>,
      start?: number,
      end?: number
    ): number {
      if (array.length === 0) return -1;

      start = start || 0;
      end = end || array.length;
      const pivot = (start + end) >> 1; // should be faster than dividing by 2

      const c = this.compareContractpartnerByName(element, array[pivot]);
      if (end - start <= 1) return c == -1 ? pivot - 1 : pivot;

      switch (c) {
        case -1:
          return this.locationOf(element, array, start, pivot);
        case 0:
          return pivot;
        default:
          return this.locationOf(element, array, pivot, end);
      }
    },
    async addContractpartnerToStore(mcp: Contractpartner) {
      /*
      this.contractpartner.splice(
        this.locationOf(mcp, this.contractpartner) + 1,
        0,
        mcp
      );
      */
      this.contractpartner.push(mcp);
      this.contractpartner.sort(this.compareContractpartnerByName);
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
