<template>
  <ModalDelete
    :title="$t('Capitalsource.title.delete')"
    :server-errors="serverErrors"
    ref="modalComponent"
    @confirm="deleteCapitalsource"
  >
    <template #details>
      <ModalDeleteRow :label="$t('General.name')" highlight-value>
        {{ mcs.comment }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('Capitalsource.type')">
        {{ typeString }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('Capitalsource.state')">
        {{ stateString }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.iban')">
        <SpanIban :iban="mcs.accountNumber" />
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.bic')">
        {{ mcs.bankCode }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.validFrom')">
        <SpanDate :date="mcs.validFrom" />
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('General.validTil')">
        <SpanDate :date="mcs.validTil" />
      </ModalDeleteRow>
    </template>
  </ModalDelete>
</template>

<script lang="ts" setup>
import ModalDelete from "@/components/common/ModalDelete.vue";
import ModalDeleteRow from "@/components/common/ModalDeleteRow.vue";
import SpanDate from "@/components/common/SpanDate.vue";
import SpanIban from "@/components/common/SpanIban.vue";
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import { capitalsourceStateNames } from "@/model/capitalsource/CapitalsourceState";
import { capitalsourceTypeNames } from "@/model/capitalsource/CapitalsourceType";
import CapitalsourceService from "@/service/CapitalsourceService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { computed, ref, useTemplateRef } from "vue";

const serverErrors = ref(new Array<string>());

const mcs = ref({} as Capitalsource);
const modalComponent = useTemplateRef<typeof ModalDelete>("modalComponent");
const emit = defineEmits<{
  capitalsourceDeleted: [capitalsource: Capitalsource];
}>();

const typeString = computed(() => {
  return capitalsourceTypeNames[mcs.value.type];
});

const stateString = computed(() => {
  return capitalsourceStateNames[mcs.value.state];
});

const _show = (_mcs: Capitalsource) => {
  mcs.value = _mcs;
  serverErrors.value = new Array<string>();
  modalComponent.value?._show();
};

const deleteCapitalsource = () => {
  serverErrors.value = new Array<string>();

  CapitalsourceService.deleteCapitalsource(mcs.value.id)
    .then(() => {
      modalComponent.value?._hide();
      emit("capitalsourceDeleted", mcs.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

defineExpose({ _show });
</script>
