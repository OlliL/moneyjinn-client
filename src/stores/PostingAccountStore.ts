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
    updatePostingAccountInStore(mcs: PostingAccount) {
      const pos = this.postingAccount.findIndex((entry) => entry.id === mcs.id);
      if (pos !== undefined) this.postingAccount.splice(pos, 1, mcs);
      this.postingAccount.sort((a, b) => a.name.localeCompare(b.name));
    },
    deletePostingAccount(mcs: PostingAccount) {
      this.postingAccount = this.postingAccount.filter(
        (originalMcs) => mcs.id !== originalMcs.id
      );
    },
    async addPostingAccountToStore(mpa: PostingAccount) {
      if (this.postingAccount.length > 0) {
        this.postingAccount.push(mpa);
        this.postingAccount.sort((a, b) => a.name.localeCompare(b.name));
      }
    },
  },
});
