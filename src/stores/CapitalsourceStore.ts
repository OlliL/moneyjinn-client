import { WebSocketSingleton } from "@/config/WebSocketSingleton";
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import { CapitalsourceType } from "@/model/capitalsource/CapitalsourceType";
import type { SelectBoxValue } from "@/model/SelectBoxValue";
import type { CapitalsourceChangedEventTransport } from "@/model/wsevent/CapitalsourceChangedEventTransport";
import CapitalsourceService from "@/service/CapitalsourceService";
import { mapCapitalsourceTransportToModel } from "@/service/mapper/CapitalsourceTransportMapper";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useUserSessionStore } from "./UserSessionStore";

export const useCapitalsourceStore = defineStore("capitalsource", () => {
  const capitalsource = ref<Array<Capitalsource>>([]);

  const userSessionStore = useUserSessionStore();
  const getUserId = computed(() => userSessionStore.getUserId);

  const initCapitalsourceStore = async () => {
    const capitalsourceArray =
      await CapitalsourceService.fetchAllCapitalsource();
    capitalsource.value = capitalsourceArray;
    capitalsource.value.sort(compareCapitalsource);
  };

  const subscribeToWebsocket = () => {
    WebSocketSingleton.getInstance().subscribe(
      "/topic/capitalsourceChanged",
      subscribeCallback,
    );
  };

  const subscribeCallback = (body: string) => {
    if (body) {
      const event: CapitalsourceChangedEventTransport = JSON.parse(body);
      const mcs = mapCapitalsourceTransportToModel(
        event.capitalsourceTransport,
      );

      switch (event.eventType) {
        case "CREATE": {
          // idempotency
          const pos = capitalsource.value.findIndex(
            (entry) => entry.id === mcs.id,
          );
          if (pos === -1) {
            capitalsource.value.push(mcs);
          } else {
            capitalsource.value.splice(pos, 1, mcs);
          }
          break;
        }
        case "UPDATE": {
          const pos = capitalsource.value.findIndex(
            (entry) => entry.id === mcs.id,
          );
          if (pos !== -1) capitalsource.value.splice(pos, 1, mcs);
          break;
        }
        case "DELETE": {
          capitalsource.value = capitalsource.value.filter(
            (originalMcs) => mcs.id !== originalMcs.id,
          );
          break;
        }
      }

      capitalsource.value.sort(compareCapitalsource);
    }
  };

  const getAsSelectBoxValues = (validityDate: Date): Array<SelectBoxValue> => {
    return capitalsource.value
      .filter((mcs) => {
        return (
          validityDate >= mcs.validFrom &&
          validityDate <= mcs.validTil &&
          mcs.type != CapitalsourceType.CREDIT &&
          (mcs.userId === getUserId.value || mcs.groupUse)
        );
      })
      .map((mcs) => {
        return { id: mcs.id, value: mcs.comment } as SelectBoxValue;
      });
  };

  const getAllAsSelectBoxValues = (): Array<SelectBoxValue> => {
    return capitalsource.value.map((mcs) => {
      return { id: mcs.id, value: mcs.comment } as SelectBoxValue;
    });
  };

  const getCapitalsource = (id: number): Capitalsource | undefined => {
    return capitalsource.value.find((mcp) => {
      return mcp.id === id;
    });
  };

  const getValidCapitalsource = (validityDate: Date) => {
    return capitalsource.value.filter((mcp) => {
      return validityDate >= mcp.validFrom && validityDate <= mcp.validTil;
    });
  };

  const getBookableValidCapitalsources = (validityDate: Date) => {
    return capitalsource.value.filter((mcp) => {
      return (
        validityDate >= mcp.validFrom &&
        validityDate <= mcp.validTil &&
        mcp.type != CapitalsourceType.CREDIT &&
        (mcp.userId === getUserId.value || mcp.groupUse)
      );
    });
  };

  const searchCapitalsources = async (
    comment: string,
    validNow?: boolean,
  ): Promise<Array<Capitalsource>> => {
    let mcs = capitalsource.value;
    if (validNow) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      mcs = getValidCapitalsource(date);
    }

    if (comment === "") {
      return mcs;
    }

    const commentUpper = comment.toUpperCase();
    return mcs.filter((entry) =>
      entry.comment.toUpperCase().includes(commentUpper),
    );
  };

  const compareCapitalsource = (a: Capitalsource, b: Capitalsource): number => {
    const aOwner = a.userId == getUserId.value;
    const bOwner = b.userId == getUserId.value;

    if (aOwner !== bOwner) return aOwner ? -1 : 1;

    const commentCompare = a.comment.localeCompare(b.comment, undefined, {
      sensitivity: "base",
    });
    if (commentCompare !== 0) return commentCompare;

    if (a.validFrom !== b.validFrom) {
      return a.validFrom > b.validFrom ? 1 : -1;
    }

    return 0;
  };

  return {
    capitalsource,
    getUserId,
    initCapitalsourceStore,
    subscribeToWebsocket,
    subscribeCallback,
    getAsSelectBoxValues,
    getAllAsSelectBoxValues,
    getCapitalsource,
    getValidCapitalsource,
    getBookableValidCapitalsources,
    searchCapitalsources,
    compareCapitalsource,
  };
});
