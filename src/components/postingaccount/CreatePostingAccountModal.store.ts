import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useCreatePostingAccountModalStore = defineStore(
  "createPostingAccountModal",
  () => {
    const open = ref(false);
    const postingAccount = ref<PostingAccount | undefined>(undefined);
    const onDone = ref<((entry: PostingAccount) => void) | undefined>(undefined);

    const openCreatePostingAccount = (cb?: (entry: PostingAccount) => void) => {
      postingAccount.value = undefined;
      onDone.value = cb;
      open.value = true;
    };

    const openEditPostingAccount = (
      entry: PostingAccount,
      cb?: (entry: PostingAccount) => void,
    ) => {
      postingAccount.value = entry;
      onDone.value = cb;
      open.value = true;
    };

    watch(open, (isOpen) => {
      if (!isOpen) {
        postingAccount.value = undefined;
      }
    });

    return {
      open,
      postingAccount,
      onDone,
      openCreatePostingAccount,
      openEditPostingAccount,
    };
  },
);

