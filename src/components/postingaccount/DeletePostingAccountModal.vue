<template>
  <ModalVue :title="$t('PostingAccount.title.delete')" ref="modalComponent">
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          {{ $t("General.name") }}
        </div>
        <div class="text-start col-sm-9">{{ mpa.name }}</div>
      </div>
    </template>
    <template #footer>
      <button
        type="button"
        class="btn btn-danger"
        @click="deletePostingAccount"
      >
        {{ $t("General.delete") }}
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";

import { handleBackendError } from "@/tools/views/ThrowError";

import type { PostingAccount } from "@/model/postingaccount/PostingAccount";

import PostingAccountControllerHandler from "@/handler/PostingAccountControllerHandler";

const serverErrors = ref(new Array<string>());

const mpa = ref({} as PostingAccount);
const modalComponent = ref();
const emit = defineEmits(["postingAccountDeleted"]);

const _show = (_mpa: PostingAccount) => {
  mpa.value = _mpa;
  modalComponent.value._show();
};

const deletePostingAccount = () => {
  serverErrors.value = new Array<string>();

  PostingAccountControllerHandler.deletePostingAccount(mpa.value.id)
    .then(() => {
      modalComponent.value._hide();
      emit("postingAccountDeleted", mpa.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

defineExpose({ _show });
</script>
