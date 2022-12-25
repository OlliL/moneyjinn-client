import CapitalsourceControllerHandler from "@/handler/CapitalsourceControllerHandler";
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import { CapitalsourceType } from "@/model/capitalsource/CapitalsourceType";
import { defineStore, mapState } from "pinia";
import { useUserSessionStore } from "./UserSessionStore";

export const useCapitalsourceStore = defineStore("capitalsource", {
  state: () => ({
    capitalsource: [] as Array<Capitalsource>,
  }),
  getters: {
    ...mapState(useUserSessionStore, ["getUserId"]),
  },
  actions: {
    async initCapitalsourceStore() {
      if (this.capitalsource.length === 0) {
        const capitalsourceArray =
          await CapitalsourceControllerHandler.fetchAllCapitalsource();
        this.capitalsource = capitalsourceArray;
        this.capitalsource.sort(this.compareCapitalsource);
      }
    },
    getCapitalsource(id: number): Capitalsource | undefined {
      return this.capitalsource.find((mcp) => {
        return mcp.id === id;
      });
    },
    getValidCapitalsource(validityDate: Date) {
      return this.capitalsource.filter((mcp) => {
        return validityDate >= mcp.validFrom && validityDate <= mcp.validTil;
      });
    },
    getBookableValidCapitalsources(validityDate: Date) {
      return this.capitalsource.filter((mcp) => {
        return (
          validityDate >= mcp.validFrom &&
          validityDate <= mcp.validTil &&
          mcp.type != CapitalsourceType.CREDIT &&
          (mcp.userId === this.getUserId || mcp.groupUse)
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
        this.capitalsource.sort(this.compareCapitalsource);
      }
    },
    updateCapitalsourceInStore(mcs: Capitalsource) {
      const pos = this.capitalsource.findIndex((entry) => entry.id === mcs.id);
      if (pos !== undefined) this.capitalsource.splice(pos, 1, mcs);
    },
    deleteCapitalsource(mcs: Capitalsource) {
      this.capitalsource = this.capitalsource.filter(
        (originalMcs) => mcs.id !== originalMcs.id
      );
    },
    compareCapitalsource(a: Capitalsource, b: Capitalsource): number {
      const aComment = a.comment.toLowerCase();
      const bComment = b.comment.toLowerCase();
      const aOwner = a.userId == this.getUserId;
      const bOwner = b.userId == this.getUserId;
      const aValidFrom = a.validFrom;
      const bValidFrom = b.validFrom;

      const ownerCompare = aOwner === bOwner ? 0 : aOwner < bOwner ? 1 : -1;
      const commentCompare =
        aComment === bComment ? 0 : aComment > bComment ? 1 : -1;
      const validFromCompare =
        aValidFrom === bValidFrom ? 0 : aValidFrom > bValidFrom ? 1 : -1;

      if (ownerCompare != 0) return ownerCompare;
      if (commentCompare != 0) return commentCompare;
      return validFromCompare;
    },
  },
});
