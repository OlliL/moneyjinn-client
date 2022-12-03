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
    getCapitalsourceForLetter(
      letter: string,
      validNow?: boolean
    ): Array<Capitalsource> {
      let mcs = this.capitalsource;
      if (validNow) {
        mcs = this.getBookableValidCapitalsources(new Date());
      }

      if (letter === "") {
        return mcs;
      }
      return mcs.filter(
        (entry) => entry.comment.substring(0, 1).toUpperCase() === letter
      );
    },
    async getCapitalsourceLetters(validNow?: boolean): Promise<Array<string>> {
      await this.initCapitalsourceStore();
      let mcs = this.capitalsource;
      if (validNow) {
        mcs = this.getBookableValidCapitalsources(new Date());
      }
      const letters = mcs.map((entry) =>
        entry.comment.substring(0, 1).toUpperCase()
      );
      const uniqueLetters = letters
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort();
      return uniqueLetters;
    },
    async addCapitalsourceToStore(mcs: Capitalsource) {
      if (this.capitalsource.length > 0) {
        this.capitalsource.push(mcs);
        this.capitalsource.sort((a, b) => a.comment.localeCompare(b.comment));
      }
    },
  },
});
