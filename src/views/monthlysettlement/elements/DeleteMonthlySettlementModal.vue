<template>
  <ModalVue
    :title="
      $t('MonthlySettlement.title.delete', { month: monthName, year: year })
    "
    max-width="max-w-md"
    ref="modalComponent"
  >
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="flex justify-center mb-4" v-if="month">
        <div class="w-full">
          <ShowMonthlySettlementVue :year="year" :month="month" />
        </div>
      </div>
    </template>
    <template #footer>
      <ButtonDeleteTwoTap
        :button-label="$t('General.delete')"
        @click="deleteMonthlySettlement"
      />
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef } from "vue";

import DivError from "@/components/common/DivError.vue";
import ModalVue from "@/components/common/Modal.vue";
import ShowMonthlySettlementVue from "./ShowMonthlySettlement.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";
import { getMonthName } from "@/tools/views/MonthName";

import ButtonDeleteTwoTap from "@/components/common/ButtonDeleteTwoTap.vue";
import MonthlySettlementService from "@/service/MonthlySettlementService";

const serverErrors = ref(new Array<string>());

const month = ref(0);
const monthName = ref("");
const year = ref(0);
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");
const emit = defineEmits<{
  monthlySettlementDeleted: [year: number, month: number];
}>();

const _show = (_year: number, _month: number) => {
  year.value = _year;
  month.value = _month;
  monthName.value = getMonthName(month.value);
  serverErrors.value = new Array<string>();
  modalComponent.value?._show();
};

const deleteMonthlySettlement = () => {
  serverErrors.value = new Array<string>();

  MonthlySettlementService.deleteMonthlySettlement(year.value, month.value)
    .then(() => {
      modalComponent.value?._hide();
      emit("monthlySettlementDeleted", year.value, month.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

defineExpose({ _show });
</script>
