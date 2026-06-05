import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useDeletePostingAccountModalStore = defineStore(
  "deletePostingAccountModal",
  () => {
    const open = ref(false);
    const postingAccount = ref({} as PostingAccount);
    const onDone = ref<(() => void) | undefined>(undefined);

    const openDeletePostingAccount = (
      postingAccountEntry: PostingAccount,
      cb?: () => void,
    ) => {
      onDone.value = cb;
      postingAccount.value = postingAccountEntry;
      open.value = true;
    };

    watch(open, (isOpen) => {
      if (!isOpen) {
        postingAccount.value = {} as PostingAccount;
      }
    });

    return {
      open,
      postingAccount,
      onDone,
      openDeletePostingAccount,
    };
  },
);
