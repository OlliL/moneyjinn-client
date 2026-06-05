<template>
  <ModalDelete
    :title="$t('PreDefMoneyflow.title.delete')"
    :server-errors="serverErrors"
    id-suffix="DeletePreDefMoneyflow"
    v-model:open="open"
    @confirm="deletePreDefMoneyflow"
  >
    <template #details>
      <ModalDeleteRow :label="$t('General.amount')" highlight-value>
        <SpanAmount :amount="mpm.amount" />
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.contractpartner')">
        {{ mpm.contractpartnerName }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.comment')">
        {{ mpm.comment }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.postingAccount')">
        {{ mpm.postingAccountName }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.capitalsource')">
        {{ mpm.capitalsourceComment }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('PreDefMoneyflow.onceAMonth')">
        <SpanBoolean :value="mpm.onceAMonth" />
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('PreDefMoneyflow.createDate')">
        <SpanDate :date="mpm.createDate" />
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.lastUsed')">
        <SpanDate :date="mpm.lastUsed" />
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('PreDefMoneyflow.favorite')">
        <FavoriteIcon
          v-if="mpm.isFavorite"
          :text="mpm.favoriteAbbreviation"
          :color="mpm.favoriteColor"
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
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import PreDefMoneyflowService from "@/service/PreDefMoneyflowService";
import useDeletePreDefMoneyflowModalStore from "./DeletePreDefMoneyflowModal.store";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";

const serverErrors = ref(new Array<string>());
const { open, preDefMoneyflow: selectedForDelete, onDone } = storeToRefs(
  useDeletePreDefMoneyflowModalStore(),
);
const mpm = computed(() => selectedForDelete.value as PreDefMoneyflow);

watch(open, (newVal) => {
  if (newVal) {
    serverErrors.value = new Array<string>();
  }
});

const deletePreDefMoneyflow = () => {
  serverErrors.value = new Array<string>();

  PreDefMoneyflowService.deletePreDefMoneyflow(mpm.value.id)
    .then(() => {
      open.value = false;
      onDone.value?.();
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

</script>
