<template>
  <ModalDelete
    :title="$t('PreDefMoneyflow.title.delete')"
    id-suffix="DeletePreDefMoneyflow"
    v-model:server-errors="serverErrors"
    v-model:open="open"
    @confirm="deletePreDefMoneyflow"
  >
    <template #details>
      <ModalDeleteRow :label="$t('General.amount')" highlight-value>
        <SpanAmount :amount="preDefMoneyflow.amount" />
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.contractpartner')">
        {{ preDefMoneyflow.contractpartnerName }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.comment')">
        {{ preDefMoneyflow.comment }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.postingAccount')">
        {{ preDefMoneyflow.postingAccountName }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.capitalsource')">
        {{ preDefMoneyflow.capitalsourceComment }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('PreDefMoneyflow.onceAMonth')">
        <SpanBoolean :value="preDefMoneyflow.onceAMonth" />
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('PreDefMoneyflow.createDate')">
        <SpanDate :date="preDefMoneyflow.createDate" />
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.lastUsed')">
        <SpanDate :date="preDefMoneyflow.lastUsed" />
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('PreDefMoneyflow.favorite')">
        <FavoriteIcon
          v-if="preDefMoneyflow.isFavorite"
          :text="preDefMoneyflow.favoriteAbbreviation"
          :color="preDefMoneyflow.favoriteColor"
          size="sm"
        />
        <span v-else>-</span>
      </ModalDeleteRow>
    </template>
  </ModalDelete>
</template>

<script lang="ts" setup>
import FavoriteIcon from "@/components/common/FavoriteIcon.vue";
import ModalDelete from "@/components/common/ModalDelete.vue";
import ModalDeleteRow from "@/components/common/ModalDeleteRow.vue";
import SpanAmount from "@/components/common/SpanAmount.vue";
import SpanBoolean from "@/components/common/SpanBoolean.vue";
import SpanDate from "@/components/common/SpanDate.vue";
import PreDefMoneyflowService from "@/service/PreDefMoneyflowService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import useDeletePreDefMoneyflowModalStore from "./DeletePreDefMoneyflowModal.store";

const serverErrors = ref(new Array<string>());
const { open, preDefMoneyflow, onDone } = storeToRefs(
  useDeletePreDefMoneyflowModalStore(),
);

const deletePreDefMoneyflow = () => {
  PreDefMoneyflowService.deletePreDefMoneyflow(preDefMoneyflow.value.id)
    .then(() => {
      open.value = false;
      onDone.value?.();
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};
</script>
