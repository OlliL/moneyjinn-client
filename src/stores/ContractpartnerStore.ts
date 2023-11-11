import ContractpartnerControllerHandler from "@/handler/ContractpartnerControllerHandler";
import { mapContractpartnerTransportToModel } from "@/handler/mapper/ContractpartnerTransportMapper";
import { WebSocketHandler } from "@/handler/WebSocketHandler";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import type { ContractpartnerChangedEventTransport } from "@/model/wsevent/ContractpartnerChangedEventTransport";
import type { SelectBoxValue } from "@/model/SelectBoxValue";
import { defineStore } from "pinia";

export const useContractpartnerStore = defineStore("contractpartner", {
  state: () => ({
    contractpartner: [] as Array<Contractpartner>,
  }),
  getters: {},
  actions: {
    initContractpartnerStore() {
      return ContractpartnerControllerHandler.fetchAllContractpartner().then(
        (contractpartnerArray) => {
          this.contractpartner = contractpartnerArray;
          this.contractpartner.sort(this.compareContractpartnerByName);
        },
      );
    },
    subscribeToWebsocket() {
      WebSocketHandler.getInstance().subscribe(
        "/topic/contractpartnerChanged",
        this.subscribeCallback,
      );
    },
    subscribeCallback(body: string) {
      if (body) {
        const event: ContractpartnerChangedEventTransport = JSON.parse(body);
        const mcp = mapContractpartnerTransportToModel(
          event.contractpartnerTransport,
        );

        switch (event.eventType) {
          case "CREATE": {
            this.contractpartner.push(mcp);
            break;
          }
          case "UPDATE": {
            const pos = this.contractpartner.findIndex(
              (entry) => entry.id === mcp.id,
            );
            if (pos !== undefined) this.contractpartner.splice(pos, 1, mcp);
            break;
          }
          case "DELETE": {
            this.contractpartner = this.contractpartner.filter(
              (originalMcp) => mcp.id !== originalMcp.id,
            );
            break;
          }
        }

        this.contractpartner.sort(this.compareContractpartnerByName);
      }
    },
    getAsSelectBoxValues(validityDate?: Date): Array<SelectBoxValue> {
      return this.contractpartner
        .filter((mcs) => {
          return validityDate
            ? validityDate >= mcs.validFrom && validityDate <= mcs.validTil
            : true;
        })
        .map((mcs) => {
          return { id: mcs.id, value: mcs.name } as SelectBoxValue;
        });
    },
    getValidContractpartner(validityDate: Date) {
      return this.contractpartner.filter((mcp) => {
        return validityDate >= mcp.validFrom && validityDate <= mcp.validTil;
      });
    },
    async searchContractpartners(
      comment: String,
      validNow?: boolean,
    ): Promise<Array<Contractpartner>> {
      let mcp = this.contractpartner;
      if (validNow) {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        mcp = this.getValidContractpartner(date);
      }

      if (comment === "") {
        return mcp;
      }

      const commentUpper = comment.toUpperCase();
      return mcp.filter((entry) =>
        entry.name.toUpperCase().includes(commentUpper),
      );
    },
    getContractpartner(id: number): Contractpartner | undefined {
      return this.contractpartner.find((entry) => entry.id === id);
    },
    compareContractpartnerByName(
      a: Contractpartner,
      b: Contractpartner,
    ): number {
      const al = a.name.toLowerCase();
      const bl = b.name.toLowerCase();
      return al === bl ? 0 : al > bl ? 1 : -1;
    },
  },
});
