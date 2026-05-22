<template>
  <ModalDelete
    :title="$t('PostingAccount.title.delete')"
    :server-errors="serverErrors"
    ref="modalComponent"
    @confirm="deletePostingAccount"
  >
    <template #details>
      <ModalDeleteRow :label="$t('General.name')" highlight-value>
        {{ mpa.name }}
      </ModalDeleteRow>
    </template>
  </ModalDelete>
</template>

<script lang="ts" setup>
import ModalDelete from "@/components/common/ModalDelete.vue";
import ModalDeleteRow from "@/components/common/ModalDeleteRow.vue";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import PostingAccountService from "@/service/PostingAccountService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { ref, useTemplateRef } from "vue";

const serverErrors = ref(new Array<string>());

const mpa = ref({} as PostingAccount);
const modalComponent = useTemplateRef<typeof ModalDelete>("modalComponent");
const emit = defineEmits(["postingAccountDeleted"]);

const _show = (_mpa: PostingAccount) => {
  mpa.value = _mpa;
  serverErrors.value = new Array<string>();
  modalComponent.value?._show();
};

const deletePostingAccount = () => {
  serverErrors.value = new Array<string>();

  PostingAccountService.deletePostingAccount(mpa.value.id)
    .then(() => {
      modalComponent.value?._hide();
      emit("postingAccountDeleted", mpa.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

defineExpose({ _show });
</script>
