<template>
  <table
    class="table table-striped table-bordered table-hover"
    v-if="monthlySettlementsNoCredit.length"
  >
    <col style="width: 70%" />
    <col style="width: 30%" />
    <thead>
      <tr>
        <th>Kapitalquelle</th>
        <th>Betrag</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="mms in monthlySettlementsNoCredit" :key="mms.id">
        <td class="text-start">{{ mms.capitalsourceComment }}</td>
        <td class="text-end"><SpanAmount :amount="mms.amount" /></td>
      </tr>
      <tr>
        <td class="text-end">&sum;</td>
        <td class="text-end">
          <u><SpanAmount :amount="monthlySettlementNoCreditSum" /></u>
        </td>
      </tr>
    </tbody>
  </table>
  <table
    class="table table-striped table-bordered table-hover"
    v-if="monthlySettlementsCredit.length"
  >
    <col style="width: 70%" />
    <col style="width: 30%" />
    <thead v-if="!monthlySettlementsNoCredit.length">
      <tr>
        <th>Kapitalquelle</th>
        <th>Betrag</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="mms in monthlySettlementsCredit" :key="mms.id">
        <td class="text-start">{{ mms.capitalsourceComment }}</td>
        <td class="text-end"><SpanAmount :amount="mms.amount" /></td>
      </tr>
      <tr>
        <td class="text-end">&sum;</td>
        <td class="text-end">
          <u>
            <SpanAmount :amount="monthlySettlementCreditSum" />
          </u>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";

import SpanAmount from "../SpanAmount.vue";

import { CapitalsourceType } from "@/model/capitalsource/CapitalsourceType";
import type { MonthlySettlement } from "@/model/monthlysettlement/MonthlySettlement";

import MonthlySettlementControllerHandler from "@/handler/MonthlySettlementControllerHandler";

const props = defineProps({
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
});

const dataLoaded = ref(false);
const monthlySettlementsNoCredit = ref({} as Array<MonthlySettlement>);
const monthlySettlementsCredit = ref({} as Array<MonthlySettlement>);
const monthlySettlementNoCreditSum = ref(0);
const monthlySettlementCreditSum = ref(0);

const loadMonthlySettlements = (year: number, month: number) => {
  dataLoaded.value = false;
  MonthlySettlementControllerHandler.getMonthlySettlementList(year, month).then(
    (monthlySettlements: Array<MonthlySettlement>) => {
      monthlySettlementsCredit.value = new Array<MonthlySettlement>();
      monthlySettlementsNoCredit.value = new Array<MonthlySettlement>();
      monthlySettlementCreditSum.value = 0;
      monthlySettlementNoCreditSum.value = 0;

      for (let mms of monthlySettlements) {
        if (mms.capitalsourceType === CapitalsourceType.CREDIT) {
          monthlySettlementsCredit.value.push(mms);
          monthlySettlementCreditSum.value += mms.amount;
        } else {
          monthlySettlementsNoCredit.value.push(mms);
          monthlySettlementNoCreditSum.value += mms.amount;
        }
      }
      dataLoaded.value = true;
    }
  );
};

onMounted(() => {
  loadMonthlySettlements(props.year, props.month);
});

watch(
  () => props.month,
  (newVal, oldVal) => {
    if (newVal != oldVal) {
      loadMonthlySettlements(props.year, newVal);
    }
  },
  { immediate: true }
);
</script>
