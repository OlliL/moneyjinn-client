import { mapPostingAccountTransportToModel } from "@/service/mapper/PostingAccountTransportMapper";
import PostingAccountService from "@/service/PostingAccountService";
import { WebSocketSingleton } from "@/config/WebSocketSingleton";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import type { PostingAccountChangedEventTransport } from "@/model/wsevent/PostingAccountChangedEventTransport";
import type { SelectBoxValue } from "@/model/SelectBoxValue";
import { defineStore } from "pinia";

export const usePostingAccountStore = defineStore("postingAccount", {
  state: () => ({
    postingAccount: [] as Array<PostingAccount>,
  }),
  getters: {
    getPostingAccount(): Array<PostingAccount> {
      return this.postingAccount;
    },
    getAsSelectBoxValues(): Array<SelectBoxValue> {
      return this.postingAccount.map((mpa) => {
        return { id: mpa.id, value: mpa.name } as SelectBoxValue;
      });
    },
  },
  actions: {
    initPostingAccountStore() {
      return PostingAccountService.fetchAllPostingAccount().then(
        (postingAccountArray) => {
          this.postingAccount = postingAccountArray;
        },
      );
    },
    subscribeToWebsocket() {
      WebSocketSingleton.getInstance().subscribe(
        "/topic/postingAccountChanged",
        this.subscribeCallback,
      );
    },
    subscribeCallback(body: string) {
      if (body) {
        const event: PostingAccountChangedEventTransport = JSON.parse(body);
        const mpa = mapPostingAccountTransportToModel(
          event.postingAccountTransport,
        );

        switch (event.eventType) {
          case "CREATE": {
            this.postingAccount.push(mpa);
            break;
          }
          case "UPDATE": {
            const pos = this.postingAccount.findIndex(
              (entry) => entry.id === mpa.id,
            );
            if (pos !== undefined) this.postingAccount.splice(pos, 1, mpa);
            break;
          }
          case "DELETE": {
            this.postingAccount = this.postingAccount.filter(
              (originalMpa) => mpa.id !== originalMpa.id,
            );
            break;
          }
        }

        this.postingAccount.sort((a, b) => a.name.localeCompare(b.name));
      }
    },
    async searchPostingAccounts(
      comment: string,
    ): Promise<Array<PostingAccount>> {
      const mpa = this.postingAccount;

      if (comment === "") {
        return mpa;
      }

      const commentUpper = comment.toUpperCase();
      return mpa.filter((entry) =>
        entry.name.toUpperCase().includes(commentUpper),
      );
    },
  },
});
