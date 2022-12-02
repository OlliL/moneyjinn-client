import PostingAccountControllerHandler from "@/handler/PostingAccountControllerHandler";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
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
    async addPostingAccountToStore(mpa: PostingAccount) {
      if (this.postingAccount.length > 0) {
        this.postingAccount.push(mpa);
        this.postingAccount.sort((a, b) => a.name.localeCompare(b.name));
      }
    },
  },
});
