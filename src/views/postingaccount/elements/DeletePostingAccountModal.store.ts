import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import { createDeleteModalStore } from "@/stores/DeleteModalStoreFactory";

export const useDeletePostingAccountModalStore =
  createDeleteModalStore<PostingAccount>("deletePostingAccountModal");

export default useDeletePostingAccountModalStore;
