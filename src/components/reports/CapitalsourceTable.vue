<template>
  <div class="row">
    <div class="col-xs-12 text-center">
      <table
        class="table table-striped table-bordered table-hover"
        style="table-layout: fixed"
      >
        <col style="width: 15%" />
        <col style="width: 10%" />
        <col style="width: 20%" />
        <col style="width: 10%" />
        <col style="width: 10%" />
        <col style="width: 10%" />
        <col style="width: 15%" />
        <thead>
          <tr>
            <th class="text-center">Typ</th>
            <th class="text-center">Status</th>
            <th class="text-center">Kommentar</th>
            <th class="text-center">Anfangsbetrag</th>
            <th class="text-center" v-if="currentMonthIsSettled">
              Endbetrag (fix)
            </th>
            <th class="text-center">Endbetrag (errechnet)</th>
            <th class="text-center" v-if="!currentMonthIsSettled">
              Aktueller Betrag
            </th>
            <th class="text-center" v-if="!currentMonthIsSettled">Stand</th>
            <th class="text-center" v-if="currentMonthIsSettled">Differenz</th>
          </tr>
        </thead>

        <tbody>
          <CapitalsourceTableRowVue
            v-for="data in capitalsourceData"
            :key="data.capitalsourceComment"
            v-bind="{
              ...data,
              currentMonthIsSettled: currentMonthIsSettled,
            }"
          />
          <tr>
            <td class="text-end" colspan="3">&sum;</td>
            <td class="text-end">
              <u><SpanAmount :amount="amountBeginOfMonthFixedSum" /></u>
            </td>
            <td class="text-end" v-if="currentMonthIsSettled">
              <u><SpanAmount :amount="amountEndOfMonthFixedSum" /></u>
            </td>
            <td class="text-end">
              <u><SpanAmount :amount="amountEndOfMonthCalculatedSum" /></u>
            </td>
            <td class="text-end" v-if="!currentMonthIsSettled">
              <u><SpanAmount :amount="amountCurrentSum" /></u>
            </td>
            <td class="text-end" v-if="currentMonthIsSettled">
              <u><SpanAmount :amount="differenceFixedCalculatedSum" /></u>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import CapitalsourceTableRowVue from "./CapitalsourceTableRow.vue";
import SpanAmount from "../SpanAmount.vue";

import type { ReportTurnoverCapitalsource } from "@/model/report/ReportTurnoverCapitalsource";

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
    0
  );
});
const amountEndOfMonthCalculatedSum = computed(() => {
  return props.capitalsourceData.reduce(
    (acc, cur) => acc + cur.amountEndOfMonthCalculated,
    0
  );
});
const amountEndOfMonthFixedSum = computed(() => {
  return props.capitalsourceData.reduce(
    (acc, cur) =>
      acc + (cur.amountEndOfMonthFixed ? cur.amountEndOfMonthFixed : 0),
    0
  );
});
const amountCurrentSum = computed(() => {
  return props.capitalsourceData.reduce(
    (acc, cur) => acc + (cur.amountCurrent ? cur.amountCurrent : 0),
    0
  );
});
const differenceFixedCalculatedSum = computed(() => {
  return props.capitalsourceData.reduce(
    (acc, cur) =>
      acc +
      ((cur.amountEndOfMonthFixed ? cur.amountEndOfMonthFixed : 0) -
        cur.amountEndOfMonthCalculated),
    0
  );
});
</script>
