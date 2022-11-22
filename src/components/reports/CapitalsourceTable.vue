<template>
  <div class="row justify-content-md-center py-4">
    <div class="col col-lg-8">
      <div class="card">
        <div class="card-header text-center p-3">
          <h4>{{ groupName }}</h4>
        </div>
        <div class="card-body">
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
                    <th class="text-center" v-if="!currentMonthIsSettled">
                      Stand
                    </th>
                    <th class="text-center" v-if="currentMonthIsSettled">
                      Differenz
                    </th>
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
                    <td :class="amountBeginOfMonthFixedSumClass">
                      <u>{{ amountBeginOfMonthFixedSumString }} &euro;</u>
                    </td>
                    <td
                      :class="amountEndOfMonthFixedSumClass"
                      v-if="currentMonthIsSettled"
                    >
                      <u>{{ amountEndOfMonthFixedSumString }} &euro;</u>
                    </td>
                    <td :class="amountEndOfMonthCalculatedSumClass">
                      <u>{{ amountEndOfMonthCalculatedSumString }} &euro;</u>
                    </td>
                    <td
                      :class="amountCurrentSumClass"
                      v-if="!currentMonthIsSettled"
                    >
                      <u>{{ amountCurrentSumString }} &euro;</u>
                    </td>
                    <td
                      :class="differenceFixedCalculatedSumClass"
                      v-if="currentMonthIsSettled"
                    >
                      <u>{{ differenceFixedCalculatedSumString }} &euro;</u>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- FIXME: turnover mini-table for the assets -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { ReportTurnoverCapitalsource } from "@/model/report/ReportTurnoverCapitalsourceTransport";
import { formatNumber, redIfNegativeEnd } from "@/tools/views/FormatNumber";
import { defineComponent } from "vue";
import CapitalsourceTableRowVue from "./CapitalsourceTableRow.vue";
export default defineComponent({
  name: "CapitalsourceTable",
  props: {
    capitalsourceData: {
      type: Array<ReportTurnoverCapitalsource>,
      required: true,
    },
    groupName: {
      type: String,
      required: true,
    },
    currentMonthIsSettled: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    amountBeginOfMonthFixedSum(): number {
      return this.capitalsourceData.reduce(
        (acc, cur) => acc + cur.amountBeginOfMonthFixed,
        0
      );
    },
    amountBeginOfMonthFixedSumClass(): string {
      return redIfNegativeEnd(this.amountBeginOfMonthFixedSum);
    },
    amountBeginOfMonthFixedSumString(): string {
      return formatNumber(this.amountBeginOfMonthFixedSum, 2);
    },

    amountEndOfMonthCalculatedSum(): number {
      return this.capitalsourceData.reduce(
        (acc, cur) => acc + cur.amountEndOfMonthCalculated,
        0
      );
    },
    amountEndOfMonthCalculatedSumClass(): string {
      return redIfNegativeEnd(this.amountEndOfMonthCalculatedSum);
    },
    amountEndOfMonthCalculatedSumString(): string {
      return formatNumber(this.amountEndOfMonthCalculatedSum, 2);
    },

    amountEndOfMonthFixedSum(): number {
      return this.capitalsourceData.reduce(
        (acc, cur) =>
          acc + (cur.amountEndOfMonthFixed ? cur.amountEndOfMonthFixed : 0),
        0
      );
    },
    amountEndOfMonthFixedSumClass(): string {
      return redIfNegativeEnd(this.amountEndOfMonthFixedSum);
    },
    amountEndOfMonthFixedSumString(): string {
      return formatNumber(this.amountEndOfMonthFixedSum, 2);
    },

    amountCurrentSum(): number {
      return this.capitalsourceData.reduce(
        (acc, cur) => acc + (cur.amountCurrent ? cur.amountCurrent : 0),
        0
      );
    },
    amountCurrentSumClass(): string {
      return redIfNegativeEnd(this.amountCurrentSum);
    },
    amountCurrentSumString(): string {
      return formatNumber(this.amountCurrentSum, 2);
    },

    differenceFixedCalculatedSum(): number {
      return this.capitalsourceData.reduce(
        (acc, cur) =>
          acc +
          ((cur.amountEndOfMonthFixed ? cur.amountEndOfMonthFixed : 0) -
            cur.amountEndOfMonthCalculated),
        0
      );
    },
    differenceFixedCalculatedSumClass(): string {
      return redIfNegativeEnd(this.differenceFixedCalculatedSum);
    },
    differenceFixedCalculatedSumString(): string {
      return formatNumber(this.differenceFixedCalculatedSum, 2);
    },
  },
  components: { CapitalsourceTableRowVue },
});
</script>
