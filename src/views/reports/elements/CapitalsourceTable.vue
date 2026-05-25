<template>
  <div class="flex justify-center w-full">
    <div class="w-full">
      <template v-if="isDesktop().value">
        <CapitalsourceTableDesktop
          :capitalsource-data="capitalsourceData"
          :current-month-is-settled="currentMonthIsSettled"
          :amount-begin-of-month-fixed-sum="amountBeginOfMonthFixedSum"
          :amount-end-of-month-calculated-sum="amountEndOfMonthCalculatedSum"
          :amount-end-of-month-fixed-sum="amountEndOfMonthFixedSum"
          :amount-current-sum="amountCurrentSum"
          :difference-fixed-calculated-sum="differenceFixedCalculatedSum"
        />
      </template>
      <template v-else>
        <CapitalsourceTableMobile
          :capitalsource-data="capitalsourceData"
          :current-month-is-settled="currentMonthIsSettled"
          :amount-begin-of-month-fixed-sum="amountBeginOfMonthFixedSum"
          :amount-end-of-month-calculated-sum="amountEndOfMonthCalculatedSum"
          :amount-end-of-month-fixed-sum="amountEndOfMonthFixedSum"
          :amount-current-sum="amountCurrentSum"
          :difference-fixed-calculated-sum="differenceFixedCalculatedSum"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ReportTurnoverCapitalsource } from "@/model/report/ReportTurnoverCapitalsource";
import { isDesktop } from "@/tools/views/IsDesktop";
import { computed } from "vue";
import CapitalsourceTableDesktop from "./CapitalsourceTableDesktop.vue";
import CapitalsourceTableMobile from "./CapitalsourceTableMobile.vue";

const props = defineProps({
  capitalsourceData: {
    type: Array<ReportTurnoverCapitalsource>,
    required: true,
  },
  currentMonthIsSettled: {
    type: Boolean,
    required: true,
  },
});

import { useCapitalsourceSums } from "./useCapitalsourceSums";

const {
  amountBeginOfMonthFixedSum,
  amountEndOfMonthCalculatedSum,
  amountEndOfMonthFixedSum,
  amountCurrentSum,
  differenceFixedCalculatedSum,
} = useCapitalsourceSums(computed(() => props.capitalsourceData));
</script>
