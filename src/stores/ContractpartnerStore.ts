import { WebSocketSingleton } from "@/config/WebSocketSingleton";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import type { SelectBoxValue } from "@/model/SelectBoxValue";
import type { ContractpartnerChangedEventTransport } from "@/model/wsevent/ContractpartnerChangedEventTransport";
import ContractpartnerService from "@/service/ContractpartnerService";
import { mapContractpartnerTransportToModel } from "@/service/mapper/ContractpartnerTransportMapper";
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
          if (pos === undefined) {
            contractpartner.value.push(mcp);
          } else {
            contractpartner.value.splice(pos, 1, mcp);
          }
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
      .filter((mcs) =>
        validityDate
          ? validityDate >= mcs.validFrom && validityDate <= mcs.validTil
          : true,
      )
      .map((mcs) => ({ id: mcs.id, value: mcs.name }));
  }

  function getValidContractpartner(validityDate: Date) {
    return contractpartner.value.filter(
      (mcp) => validityDate >= mcp.validFrom && validityDate <= mcp.validTil,
    );
  }

  async function searchContractpartners(
    comment: string, // Removed validNow parameter
  ): Promise<Array<Contractpartner>> {
    if (comment === "") {
      return contractpartner.value;
    }

    const escapedSearch = comment.replace(
      /[.*+?^${}()|[\]\\]/g,
      String.raw`\$&`,
    );
    const regex = new RegExp(escapedSearch, "i");
    return contractpartner.value.filter((entry) => regex.test(entry.name));
  }

  function getContractpartner(id: number): Contractpartner | undefined {
    return contractpartner.value.find((entry) => entry.id === id);
  }

  function compareContractpartnerByName(
    a: Contractpartner,
    b: Contractpartner,
  ): number {
    return a.name.localeCompare(b.name, undefined, {
      sensitivity: "base",
    });
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
