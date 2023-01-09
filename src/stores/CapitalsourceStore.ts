import CapitalsourceControllerHandler from "@/handler/CapitalsourceControllerHandler";
import { mapCapitalsourceTransportToModel } from "@/handler/mapper/CapitalsourceTransportMapper";
import { WebSocketHandler } from "@/handler/WebSocketHandler";
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import { CapitalsourceType } from "@/model/capitalsource/CapitalsourceType";
import type { CapitalsourceChangedEventTransport } from "@/model/rest/wsevent/CapitalsourceChangedEventTransport";
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
    subscribeToWebsocket() {
      WebSocketHandler.getInstance().subscribe(
        "/topic/capitalsourceChanged",
        this.subscribeCallback
      );
    },
    subscribeCallback(body: string) {
      if (body) {
        const event: CapitalsourceChangedEventTransport = JSON.parse(body);
        const mcs = mapCapitalsourceTransportToModel(
          event.capitalsourceTransport
        );

        switch (event.eventType) {
          case "CREATE": {
            this.capitalsource.push(mcs);
            break;
          }
          case "UPDATE": {
            const pos = this.capitalsource.findIndex(
              (entry) => entry.id === mcs.id
            );
            if (pos !== undefined) this.capitalsource.splice(pos, 1, mcs);
            break;
          }
          case "DELETE": {
            this.capitalsource = this.capitalsource.filter(
              (originalMcs) => mcs.id !== originalMcs.id
            );
            break;
          }
        }

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
    async searchCapitalsources(
      comment: String,
      validNow?: boolean
    ): Promise<Array<Capitalsource>> {
      await this.initCapitalsourceStore();

      let mcs = this.capitalsource;
      if (validNow) {
        mcs = this.getBookableValidCapitalsources(new Date());
      }

      if (comment === "") {
        return mcs;
      }

      const commentUpper = comment.toUpperCase();
      return mcs.filter((entry) =>
        entry.comment.toUpperCase().includes(commentUpper)
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
