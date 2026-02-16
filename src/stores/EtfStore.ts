import { mapEtfTransportToModel } from "@/service/mapper/EtfTransportMapper";
import { WebSocketSingleton } from "@/config/WebSocketSingleton";
import type { Etf } from "@/model/etf/Etf";
import type { SelectBoxValue } from "@/model/SelectBoxValue";
import { defineStore } from "pinia";
import { ref } from "vue";
import CrudEtfService from "@/service/CrudEtfService";
import type { EtfChangedEventTransport } from "@/model/wsevent/EtfChangedEventTransport";

export const useEtfStore = defineStore("etf", () => {
  const etf = ref([] as Array<Etf>);

  function initEtfStore() {
    return CrudEtfService.fetchAllEtf().then((etfArray) => {
      etf.value = etfArray;
      etf.value.sort(compareEtfByName);
    });
  }

  function subscribeToWebsocket() {
    WebSocketSingleton.getInstance().subscribe(
      "/topic/etfChanged",
      subscribeCallback,
    );
  }

  function subscribeCallback(body: string) {
    if (body) {
      const event: EtfChangedEventTransport = JSON.parse(body);
      const met = mapEtfTransportToModel(event.etfTransport);

      switch (event.eventType) {
        case "CREATE": {
          // idempotency
          const pos = etf.value.findIndex((entry) => entry.id === met.id);
          if (pos === undefined) {
            etf.value.push(met);
          } else {
            etf.value.splice(pos, 1, met);
          }
          break;
        }
        case "UPDATE": {
          const pos = etf.value.findIndex((entry) => entry.id === met.id);
          if (pos !== undefined) etf.value.splice(pos, 1, met);
          break;
        }
        case "DELETE": {
          etf.value = etf.value.filter(
            (originalMcp) => met.id !== originalMcp.id,
          );
          break;
        }
      }

      etf.value.sort(compareEtfByName);
    }
  }

  function getAsSelectBoxValues(validityDate?: Date): Array<SelectBoxValue> {
    return etf.value.map((mcs) => {
      return { id: mcs.id, value: mcs.name } as SelectBoxValue;
    });
  }

  async function searchEtfs(comment: string): Promise<Array<Etf>> {
    let met = etf.value;

    if (comment === "") {
      return met;
    }

    const commentUpper = comment.toUpperCase();
    return met.filter((entry) =>
      entry.name.toUpperCase().includes(commentUpper),
    );
  }

  function getEtf(id: number): Etf | undefined {
    return etf.value.find((entry) => entry.id === id);
  }

  function getFavoriteEtf(): Etf | undefined {
    return etf.value.find((entry) => entry.isFavorite);
  }

  function compareEtfByName(a: Etf, b: Etf): number {
    const al = a.name.toLowerCase();
    const bl = b.name.toLowerCase();

    if (al === bl) return 0;
    else if (al > bl) return 1;
    return -1;
  }

  return {
    etf,
    getEtf,
    getFavoriteEtf,
    searchEtfs,
    getAsSelectBoxValues,
    subscribeToWebsocket,
    initEtfStore,
  };
});
