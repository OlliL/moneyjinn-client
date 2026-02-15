<template>
  <DivError :server-errors="serverErrors" />
  <table
    class="table table-striped table-bordered table-hover"
    v-if="monthlySettlementsNoCredit.length"
  >
    <colgroup>
      <col style="width: 70%" />
      <col style="width: 30%" />
    </colgroup>
    <thead>
      <tr>
        <th scope="col">{{ $t("General.capitalsource") }}</th>
        <th scope="col">{{ $t("General.amount") }}</th>
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
    <colgroup>
      <col style="width: 70%" />
      <col style="width: 30%" />
    </colgroup>
    <thead v-if="!monthlySettlementsNoCredit.length">
      <tr>
        <th scope="col">{{ $t("General.capitalsource") }}</th>
        <th scope="col">{{ $t("General.amount") }}</th>
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

import DivError from "../DivError.vue";
import SpanAmount from "../SpanAmount.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";

import { CapitalsourceType } from "@/model/capitalsource/CapitalsourceType";
import type { MonthlySettlement } from "@/model/monthlysettlement/MonthlySettlement";

import MonthlySettlementService from "@/service/MonthlySettlementService";

const serverErrors = ref(new Array<string>());

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
  serverErrors.value = new Array<string>();

  dataLoaded.value = false;
  MonthlySettlementService.getMonthlySettlementList(year, month)
    .then((monthlySettlements: Array<MonthlySettlement>) => {
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
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

onMounted(() => {
  loadMonthlySettlements(props.year, props.month);
});

watch([() => props.year, () => props.month], () => {
  loadMonthlySettlements(props.year, props.month);
});
</script>
