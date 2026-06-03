<template>
  <ModalDelete
    :title="$t('PreDefMoneyflow.title.delete')"
    :server-errors="serverErrors"
    ref="modalComponent"
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

      <ModalDeleteRow :label="$t('PreDefMoneyflow.lastUsed')">
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
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { ref, useTemplateRef } from "vue";

const serverErrors = ref(new Array<string>());

const mpm = ref({} as PreDefMoneyflow);
const modalComponent = useTemplateRef<typeof ModalDelete>("modalComponent");
const emit = defineEmits<{
  preDefMoneyflowDeleted: [preDefMoneyflow: PreDefMoneyflow];
}>();

const _show = (_mpm: PreDefMoneyflow) => {
  mpm.value = _mpm;
  serverErrors.value = new Array<string>();
  modalComponent.value?._show();
};

const deletePreDefMoneyflow = () => {
  serverErrors.value = new Array<string>();

  PreDefMoneyflowService.deletePreDefMoneyflow(mpm.value.id)
    .then(() => {
      modalComponent.value?._hide();
      emit("preDefMoneyflowDeleted", mpm.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

defineExpose({ _show });
</script>
