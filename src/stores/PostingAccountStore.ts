import { mapPostingAccountTransportToModel } from "@/handler/mapper/PostingAccountTransportMapper";
import PostingAccountControllerHandler from "@/handler/PostingAccountControllerHandler";
import { WebSocketHandler } from "@/handler/WebSocketHandler";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import type { PostingAccountChangedEventTransport } from "@/model/rest/wsevent/PostingAccountChangedEventTransport";
import { defineStore } from "pinia";

export const usePostingAccountStore = defineStore("postingAccount", {
  state: () => ({
    postingAccount: [] as Array<PostingAccount>,
  }),
  getters: {
    getPostingAccount(): Array<PostingAccount> {
      return this.postingAccount;
    },
  },
  actions: {
    async initPostingAccountStore() {
      if (this.postingAccount.length === 0) {
        const postingAccountArray =
          await PostingAccountControllerHandler.fetchAllPostingAccount();
        this.postingAccount = postingAccountArray;
      }
    },
    subscribeToWebsocket() {
      WebSocketHandler.getInstance().subscribe(
        "/topic/postingAccountChanged",
        this.subscribeCallback
      );
    },
    subscribeCallback(body: string) {
      if (body) {
        const event: PostingAccountChangedEventTransport = JSON.parse(body);
        const mpa = mapPostingAccountTransportToModel(
          event.postingAccountTransport
        );

        switch (event.eventType) {
          case "CREATE": {
            this.postingAccount.push(mpa);
            break;
          }
          case "UPDATE": {
            const pos = this.postingAccount.findIndex(
              (entry) => entry.id === mpa.id
            );
            if (pos !== undefined) this.postingAccount.splice(pos, 1, mpa);
            break;
          }
          case "DELETE": {
            this.postingAccount = this.postingAccount.filter(
              (originalMpa) => mpa.id !== originalMpa.id
            );
            break;
          }
        }

        this.postingAccount.sort((a, b) => a.name.localeCompare(b.name));
      }
    },
    async searchPostingAccounts(
      comment: String
    ): Promise<Array<PostingAccount>> {
      await this.initPostingAccountStore();

      const mpa = this.postingAccount;

      if (comment === "") {
        return mpa;
      }

      const commentUpper = comment.toUpperCase();
      return mpa.filter((entry) =>
        entry.name.toUpperCase().includes(commentUpper)
      );
    },
  },
});
