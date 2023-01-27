<template>
  <ModalVue title="Buchungskonto l&ouml;schen" ref="modalComponent">
    <template #body>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Name
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
        L&ouml;schen
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import ModalVue from "../Modal.vue";

import type { PostingAccount } from "@/model/postingaccount/PostingAccount";

import PostingAccountControllerHandler from "@/handler/PostingAccountControllerHandler";

const mpa = ref({} as PostingAccount);
const modalComponent = ref();
const emit = defineEmits(["postingAccountDeleted"]);

const _show = (_mpa: PostingAccount) => {
  mpa.value = _mpa;
  modalComponent.value._show();
};

const deletePostingAccount = () => {
  PostingAccountControllerHandler.deletePostingAccount(mpa.value.id).then(
    () => {
      modalComponent.value._hide();
      emit("postingAccountDeleted", mpa.value);
    }
  );
};

defineExpose({ _show });
</script>
