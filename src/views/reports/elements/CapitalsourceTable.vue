<template>
  <div class="flex justify-center w-full">
    <div class="w-full">
      <CapitalsourceTableMobile
        :capitalsource-data="capitalsourceData"
        :current-month-is-settled="currentMonthIsSettled"
        :amount-begin-of-month-fixed-sum="amountBeginOfMonthFixedSum"
        :amount-end-of-month-calculated-sum="amountEndOfMonthCalculatedSum"
        :amount-end-of-month-fixed-sum="amountEndOfMonthFixedSum"
        :amount-current-sum="amountCurrentSum"
        :difference-fixed-calculated-sum="differenceFixedCalculatedSum"
      />

      <CapitalsourceTableDesktop
        :capitalsource-data="capitalsourceData"
        :current-month-is-settled="currentMonthIsSettled"
        :amount-begin-of-month-fixed-sum="amountBeginOfMonthFixedSum"
        :amount-end-of-month-calculated-sum="amountEndOfMonthCalculatedSum"
        :amount-end-of-month-fixed-sum="amountEndOfMonthFixedSum"
        :amount-current-sum="amountCurrentSum"
        :difference-fixed-calculated-sum="differenceFixedCalculatedSum"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ReportTurnoverCapitalsource } from "@/model/report/ReportTurnoverCapitalsource";
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

const amountBeginOfMonthFixedSum = computed(() => {
  return props.capitalsourceData.reduce(
    (acc, cur) => acc + cur.amountBeginOfMonthFixed,
    0,
  );
});
const amountEndOfMonthCalculatedSum = computed(() => {
  return props.capitalsourceData.reduce(
    (acc, cur) => acc + cur.amountEndOfMonthCalculated,
    0,
  );
});
const amountEndOfMonthFixedSum = computed(() => {
  return props.capitalsourceData.reduce(
    (acc, cur) =>
      acc + (cur.amountEndOfMonthFixed ? cur.amountEndOfMonthFixed : 0),
    0,
  );
});
const amountCurrentSum = computed(() => {
  return props.capitalsourceData.reduce(
    (acc, cur) => acc + (cur.amountCurrent ? cur.amountCurrent : 0),
    0,
  );
});
const differenceFixedCalculatedSum = computed(() => {
  return props.capitalsourceData.reduce(
    (acc, cur) =>
      acc +
      ((cur.amountEndOfMonthFixed ? cur.amountEndOfMonthFixed : 0) -
        cur.amountEndOfMonthCalculated),
    0,
  );
});
</script>
