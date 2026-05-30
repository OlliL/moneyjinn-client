import type { BackendError } from "@/model/BackendError";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import PostingAccountService from "@/service/PostingAccountService";
import { vi } from "vitest";

export default class PostingAccountServiceMocker {
  static mockFetchAllPostingAccount(postingAccounts: PostingAccount[]): void {
    PostingAccountService.fetchAllPostingAccount = vi
      .fn()
      .mockResolvedValue(postingAccounts);
  }

  static mockCreatePostingAccountResolved(): void {
    PostingAccountService.createPostingAccount = vi
      .fn()
      .mockResolvedValue(undefined);
  }

  static mockCreatePostingAccountRejected(error: BackendError): void {
    PostingAccountService.createPostingAccount = vi
      .fn()
      .mockRejectedValue(error);
  }

  static mockUpdatePostingAccountResolved(): void {
    PostingAccountService.updatePostingAccount = vi
      .fn()
      .mockResolvedValue(undefined);
  }
}
