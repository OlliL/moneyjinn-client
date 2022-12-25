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
    getPostingAccountForLetter(letter: string): Array<PostingAccount> {
      const mpa = this.postingAccount;

      if (letter === "") {
        return mpa;
      }
      return mpa.filter(
        (entry) => entry.name.substring(0, 1).toUpperCase() === letter
      );
    },
    async getPostingAccountLetters(): Promise<Array<string>> {
      await this.initPostingAccountStore();
      const mpa = this.postingAccount;

      const letters = mpa.map((entry) =>
        entry.name.substring(0, 1).toUpperCase()
      );
      const uniqueLetters = letters
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort();
      return uniqueLetters;
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
