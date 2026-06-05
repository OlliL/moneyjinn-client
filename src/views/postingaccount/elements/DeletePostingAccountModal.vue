<template>
  <ModalDelete
    :title="$t('PostingAccount.title.delete')"
    id-suffix="DeletePostingAccount"
    v-model:server-errors="serverErrors"
    v-model:open="open"
    @confirm="deletePostingAccount"
  >
    <template #details>
      <ModalDeleteRow :label="$t('General.name')" highlight-value>
        {{ postingAccount?.name }}
      </ModalDeleteRow>
    </template>
  </ModalDelete>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import ModalDelete from "@/components/common/ModalDelete.vue";
import ModalDeleteRow from "@/components/common/ModalDeleteRow.vue";
import PostingAccountService from "@/service/PostingAccountService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { storeToRefs } from "pinia";
import { useDeletePostingAccountModalStore } from "./DeletePostingAccountModal.store";

const serverErrors = ref(new Array<string>());

const { open, postingAccount, onDone } = storeToRefs(
  useDeletePostingAccountModalStore(),
);

const deletePostingAccount = () => {
  PostingAccountService.deletePostingAccount(postingAccount.value.id)
    .then(() => {
      open.value = false;
      onDone.value?.();
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};
</script>
