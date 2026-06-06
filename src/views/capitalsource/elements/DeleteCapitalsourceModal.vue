<template>
  <ModalDelete
    :title="$t('Capitalsource.title.delete')"
    id-suffix="DeleteCapitalsource"
    v-model:open="open"
    :delete-action="
      () => CapitalsourceService.deleteCapitalsource(capitalsource.id)
    "
    :delete-success-action="onDone"
  >
    <template #details>
      <ModalDeleteRow :label="$t('General.name')" highlight-value>
        {{ capitalsource.comment }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('Capitalsource.type')">
        {{ typeString }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('Capitalsource.state')">
        {{ stateString }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.iban')">
        <SpanIban :iban="capitalsource.accountNumber" />
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.bic')">
        {{ capitalsource.bankCode }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.validFrom')">
        <SpanDate :date="capitalsource.validFrom" />
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.validTil')">
        <SpanDate :date="capitalsource.validTil" />
      </ModalDeleteRow>
    </template>
  </ModalDelete>
</template>

<script lang="ts" setup>
import ModalDelete from "@/components/common/ModalDelete.vue";
import ModalDeleteRow from "@/components/common/ModalDeleteRow.vue";
import SpanDate from "@/components/common/SpanDate.vue";
import SpanIban from "@/components/common/SpanIban.vue";
import { capitalsourceStateNames } from "@/model/capitalsource/CapitalsourceState";
import { capitalsourceTypeNames } from "@/model/capitalsource/CapitalsourceType";
import CapitalsourceService from "@/service/CapitalsourceService";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useDeleteCapitalsourceModalStore } from "./DeleteCapitalsourceModal.store";

const {
  open,
  entity: capitalsource,
  onDone,
} = storeToRefs(useDeleteCapitalsourceModalStore());

const typeString = computed(() =>
  capitalsource.value?.type === undefined
    ? ""
    : capitalsourceTypeNames[capitalsource.value.type],
);

const stateString = computed(() =>
  capitalsource.value?.state === undefined
    ? ""
    : capitalsourceStateNames[capitalsource.value.state],
);
</script>
