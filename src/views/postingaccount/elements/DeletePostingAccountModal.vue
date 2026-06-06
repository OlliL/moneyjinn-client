<template>
  <ModalDelete
    :title="$t('PostingAccount.title.delete')"
    id-suffix="DeletePostingAccount"
    v-model:open="open"
    :delete-action="
      () => PostingAccountService.deletePostingAccount(postingAccount.id)
    "
    :delete-success-action="onDone"
  >
    <template #details>
      <ModalDeleteRow :label="$t('General.name')" highlight-value>
        {{ postingAccount?.name }}
      </ModalDeleteRow>
    </template>
  </ModalDelete>
</template>

<script lang="ts" setup>
import ModalDelete from "@/components/common/ModalDelete.vue";
import ModalDeleteRow from "@/components/common/ModalDeleteRow.vue";
import PostingAccountService from "@/service/PostingAccountService";
import { storeToRefs } from "pinia";
import { useDeletePostingAccountModalStore } from "./DeletePostingAccountModal.store";

const {
  open,
  entity: postingAccount,
  onDone,
} = storeToRefs(useDeletePostingAccountModalStore());
</script>
