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
    getCapitalsourceForLetter(letter: string): Array<Capitalsource> {
      if (letter === "") {
        return this.capitalsource;
      }
      return this.capitalsource.filter(
        (mcs) => mcs.comment.substring(0, 1).toUpperCase() === letter
      );
    },
    async getCapitalsourceLetters(): Promise<Array<string>> {
      await this.initCapitalsourceStore();
      const letters = this.capitalsource.map((mcs) =>
        mcs.comment.substring(0, 1).toUpperCase()
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
