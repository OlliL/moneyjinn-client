import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import PostingAccountService from "@/service/PostingAccountService";
import { createCreateModalStore } from "../../stores/CreateModalStoreFactory";

export const useCreatePostingAccountModalStore =
  createCreateModalStore<PostingAccount>("createPostingAccountModal", {
    titleCreate: "PostingAccount.title.create",
    titleUpdate: "PostingAccount.title.update",
    createFn: (e) => PostingAccountService.createPostingAccount(e),
    updateFn: (e) => PostingAccountService.updatePostingAccount(e),
    getEmptyEntity: () => ({}) as PostingAccount,
  });
