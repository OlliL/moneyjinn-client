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
          <ShowMonthlySettlementVue :monthly-settlements="localSettlements" />
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
import type { MonthlySettlement } from "@/model/monthlysettlement/MonthlySettlement";
import MonthlySettlementService from "@/service/MonthlySettlementService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { getMonthName } from "@/tools/views/MonthName";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { useDeleteMonthlySettlementModalStore } from "./DeleteMonthlySettlementModal.store";
import ShowMonthlySettlementVue from "./ShowMonthlySettlement.vue";

const store = useDeleteMonthlySettlementModalStore();
const { open, onDone } = storeToRefs(store);

const localSettlements = ref<MonthlySettlement[]>([]);

watch(open, (isOpen) => {
  if (isOpen) {
    localSettlements.value = store.entity;
  }
});

const year = computed(() => localSettlements.value[0]?.year);
const month = computed(() => localSettlements.value[0]?.month);
const monthName = computed(() =>
  month.value ? getMonthName(month.value) : "",
);

const deleteMonthlySettlement = () => {
  MonthlySettlementService.deleteMonthlySettlement(year.value, month.value)
    .then(() => {
      onDone.value?.(localSettlements.value);
      open.value = false;
    })
    .catch(handleBackendError);
};
</script>
