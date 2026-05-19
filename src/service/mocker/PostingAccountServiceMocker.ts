import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import PostingAccountService from "@/service/PostingAccountService";
import { vi } from "vitest";

export default class PostingAccountServiceMocker {
  static mockFetchAllPostingAccount(postingAccounts: PostingAccount[]): void {
    PostingAccountService.fetchAllPostingAccount = vi
      .fn()
      .mockResolvedValue(postingAccounts);
  }
}
