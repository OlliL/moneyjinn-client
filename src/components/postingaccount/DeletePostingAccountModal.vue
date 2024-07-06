<template>
  <ModalVue :title="$t('PostingAccount.title.delete')" ref="modalComponent">
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="row d-flex justify-content-center mt-3">
        <div class="col-11">
          <table class="table table-bordered table-hover">
            <tbody>
              <tr>
                <th>{{ $t("General.name") }}</th>
                <td>{{ mpa.name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
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

import { handleBackendError } from "@/tools/views/HandleBackendError";

import type { PostingAccount } from "@/model/postingaccount/PostingAccount";

import PostingAccountService from "@/service/PostingAccountService";

const serverErrors = ref(new Array<string>());

const mpa = ref({} as PostingAccount);
const modalComponent = ref();
const emit = defineEmits(["postingAccountDeleted"]);

const _show = (_mpa: PostingAccount) => {
  mpa.value = _mpa;
  serverErrors.value = new Array<string>();
  modalComponent.value._show();
};

const deletePostingAccount = () => {
  serverErrors.value = new Array<string>();

  PostingAccountService.deletePostingAccount(mpa.value.id)
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

<style scoped>
th {
  background-color: #f2f2f2;
}
</style>
