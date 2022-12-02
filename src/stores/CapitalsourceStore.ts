import CapitalsourceControllerHandler from "@/handler/CapitalsourceControllerHandler";
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import { CapitalsourceType } from "@/model/capitalsource/CapitalsourceType";
import { defineStore } from "pinia";
import { useUserSessionStore } from "./UserSessionStore";

export const useCapitalsourceStore = defineStore("capitalsource", {
  state: () => ({
    capitalsource: [] as Array<Capitalsource>,
  }),
  getters: {},
  actions: {
    async initCapitalsourceStore() {
      if (this.capitalsource.length === 0) {
        const capitalsourceArray =
          await CapitalsourceControllerHandler.fetchAllCapitalsource();
        this.capitalsource = capitalsourceArray;
      }
    },
    getValidCapitalsource(validityDate: Date) {
      return this.capitalsource.filter((mcp) => {
        return validityDate >= mcp.validFrom && validityDate <= mcp.validTil;
      });
    },
    getBookableValidCapitalsources(validityDate: Date) {
      const userId = useUserSessionStore().getUserId;
      return this.capitalsource.filter((mcp) => {
        return (
          validityDate >= mcp.validFrom &&
          validityDate <= mcp.validTil &&
          mcp.type != CapitalsourceType.CREDIT &&
          (mcp.userId === userId || mcp.groupUse)
        );
      });
    },
    async addCapitalsourceToStore(mcs: Capitalsource) {
      this.capitalsource.push(mcs);
      this.capitalsource.sort((a, b) => a.comment.localeCompare(b.comment));
    },
  },
});
