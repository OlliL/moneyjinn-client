<template>
  <ModalVue
    :title="
      $t('MonthlySettlement.title.delete', { month: monthName, year: year })
    "
    max-width="max-w-md"
    id-suffix="DeleteMonthlySettlement"
    v-model:open="open"
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
import { ref, watch } from "vue";

import DivError from "@/components/common/DivError.vue";
import ModalVue from "@/components/common/Modal.vue";
import ShowMonthlySettlementVue from "./ShowMonthlySettlement.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";
import { getMonthName } from "@/tools/views/MonthName";

import ButtonDeleteTwoTap from "@/components/common/ButtonDeleteTwoTap.vue";
import MonthlySettlementService from "@/service/MonthlySettlementService";
import { storeToRefs } from "pinia";
import useDeleteMonthlySettlementModalStore from "./DeleteMonthlySettlementModal.store";

const serverErrors = ref(new Array<string>());
const { open, year, month, onDone } = storeToRefs(
  useDeleteMonthlySettlementModalStore(),
);

const selectedMonth = ref(0);
const monthName = ref("");
const selectedYear = ref(0);

watch(
  () => [year.value, month.value],
  ([nextYear, nextMonth]) => {
    if (!nextYear || !nextMonth) return;
    selectedYear.value = nextYear;
    selectedMonth.value = nextMonth;
    monthName.value = getMonthName(selectedMonth.value);
    serverErrors.value = new Array<string>();
  },
  { immediate: true },
);

const deleteMonthlySettlement = () => {
  serverErrors.value = new Array<string>();

  MonthlySettlementService.deleteMonthlySettlement(
    selectedYear.value,
    selectedMonth.value,
  )
    .then(() => {
      open.value = false;
      onDone.value?.(selectedYear.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};
</script>
