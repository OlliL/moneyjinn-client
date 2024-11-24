import ContractpartnerService from "@/service/ContractpartnerService";
import { mapContractpartnerTransportToModel } from "@/service/mapper/ContractpartnerTransportMapper";
import { WebSocketSingleton } from "@/config/WebSocketSingleton";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import type { ContractpartnerChangedEventTransport } from "@/model/wsevent/ContractpartnerChangedEventTransport";
import type { SelectBoxValue } from "@/model/SelectBoxValue";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useContractpartnerStore = defineStore("contractpartner", () => {
  const contractpartner = ref([] as Array<Contractpartner>);

  function initContractpartnerStore() {
    return ContractpartnerService.fetchAllContractpartner().then(
      (contractpartnerArray) => {
        contractpartner.value = contractpartnerArray;
        contractpartner.value.sort(compareContractpartnerByName);
      },
    );
  }

  function subscribeToWebsocket() {
    WebSocketSingleton.getInstance().subscribe(
      "/topic/contractpartnerChanged",
      subscribeCallback,
    );
  }

  function subscribeCallback(body: string) {
    if (body) {
      const event: ContractpartnerChangedEventTransport = JSON.parse(body);
      const mcp = mapContractpartnerTransportToModel(
        event.contractpartnerTransport,
      );

      switch (event.eventType) {
        case "CREATE": {
          // idempotency
          const pos = contractpartner.value.findIndex(
            (entry) => entry.id === mcp.id,
          );
          if (pos !== undefined) contractpartner.value.splice(pos, 1, mcp);
          else contractpartner.value.push(mcp);
          break;
        }
        case "UPDATE": {
          const pos = contractpartner.value.findIndex(
            (entry) => entry.id === mcp.id,
          );
          if (pos !== undefined) contractpartner.value.splice(pos, 1, mcp);
          break;
        }
        case "DELETE": {
          contractpartner.value = contractpartner.value.filter(
            (originalMcp) => mcp.id !== originalMcp.id,
          );
          break;
        }
      }

      contractpartner.value.sort(compareContractpartnerByName);
    }
  }

  function getAsSelectBoxValues(validityDate?: Date): Array<SelectBoxValue> {
    return contractpartner.value
      .filter((mcs) => {
        return validityDate
          ? validityDate >= mcs.validFrom && validityDate <= mcs.validTil
          : true;
      })
      .map((mcs) => {
        return { id: mcs.id, value: mcs.name } as SelectBoxValue;
      });
  }

  function getValidContractpartner(validityDate: Date) {
    return contractpartner.value.filter((mcp) => {
      return validityDate >= mcp.validFrom && validityDate <= mcp.validTil;
    });
  }

  async function searchContractpartners(
    comment: string,
    validNow?: boolean,
  ): Promise<Array<Contractpartner>> {
    let mcp = contractpartner.value;
    if (validNow) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      mcp = getValidContractpartner(date);
    }

    if (comment === "") {
      return mcp;
    }

    const commentUpper = comment.toUpperCase();
    return mcp.filter((entry) =>
      entry.name.toUpperCase().includes(commentUpper),
    );
  }

  function getContractpartner(id: number): Contractpartner | undefined {
    return contractpartner.value.find((entry) => entry.id === id);
  }

  function compareContractpartnerByName(
    a: Contractpartner,
    b: Contractpartner,
  ): number {
    const al = a.name.toLowerCase();
    const bl = b.name.toLowerCase();

    if (al === bl) return 0;
    else if (al > bl) return 1;
    return -1;
  }

  return {
    contractpartner,
    getContractpartner,
    searchContractpartners,
    getValidContractpartner,
    getAsSelectBoxValues,
    subscribeToWebsocket,
    initContractpartnerStore,
  };
});
