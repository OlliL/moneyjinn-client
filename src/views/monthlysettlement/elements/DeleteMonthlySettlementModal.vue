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
      <div class="flex justify-center mb-4">
        <div class="w-full">
          <ShowMonthlySettlementVue :monthly-settlements="monthlySettlements" />
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
import ButtonDeleteTwoTap from "@/components/common/ButtonDeleteTwoTap.vue";
import ModalVue from "@/components/common/Modal.vue";
import MonthlySettlementService from "@/service/MonthlySettlementService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { getMonthName } from "@/tools/views/MonthName";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useDeleteMonthlySettlementModalStore } from "./DeleteMonthlySettlementModal.store";
import ShowMonthlySettlementVue from "./ShowMonthlySettlement.vue";

const { open, monthlySettlements, onDone } = storeToRefs(
  useDeleteMonthlySettlementModalStore(),
);

const year = computed(() => monthlySettlements.value[0]?.year);
const month = computed(() => monthlySettlements.value[0]?.month);
const monthName = computed(() => getMonthName(month.value));

const deleteMonthlySettlement = () => {
  MonthlySettlementService.deleteMonthlySettlement(year.value, month.value)
    .then(() => {
      open.value = false;
      onDone.value?.(year.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError);
    });
};
</script>
