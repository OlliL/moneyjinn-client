<template>
  <tr>
    <td style="vertical-align: middle">
      <a
        class="btn btn-outline-primary"
        data-bs-toggle="collapse"
        :href="'#collapseResults' + moneyflowGroupKey"
        role="button"
        aria-expanded="false"
        aria-controls="collapseExample"
        ><span role="button" class="link-primary"
          ><i :class="collapseIconClass"></i></span
      ></a>
    </td>
    <td style="vertical-align: middle" v-if="colBookingMonth">
      <span role="button" class="link-primary"
        ><router-link
          class="nav-link button"
          :to="{
            name: Routes.ListReports,
            params: { year: moneyflowGroup.year, month: moneyflowGroup.month },
          }"
          >{{ moneyflowGroup.monthString }}
          {{ moneyflowGroup.year }}</router-link
        ></span
      >
    </td>
    <td style="vertical-align: middle" v-if="colBookingYear">
      <span role="button" class="link-primary"
        ><router-link
          class="nav-link button"
          :to="{
            name: Routes.ListReports,
            params: { year: moneyflowGroup.year },
          }"
        >
          {{ moneyflowGroup.year }}</router-link
        ></span
      >
    </td>
    <td style="vertical-align: middle" v-if="colContractpartner">
      {{ moneyflowGroup.contractpartnerName }}
    </td>

    <td
      :class="amountClass"
      style="white-space: nowrap; vertical-align: middle"
    >
      {{ amountString }} &euro;
    </td>
    <td class="text-start" style="vertical-align: middle">
      {{ moneyflowGroup.commentString }}
    </td>
  </tr>
  <tr>
    <td colspan="5" style="padding: 0">
      <div class="collapse" :id="'collapseResults' + moneyflowGroupKey">
        <table
          class="table table-striped table-bordered table-hover"
          v-if="showDetails"
        >
          <thead>
            <tr>
              <th>Buchungsdatum</th>
              <th>Betrag</th>
              <th>Vertragspartner</th>
              <th>Kommentar</th>
              <th>Buchungskonto</th>
              <th>Kapitalquelle</th>
              <th colspan="2"></th>
            </tr>
          </thead>
          <tbody>
            <SearchMoneyflowResultRowVue
              v-for="moneyflow of moneyflowGroup.moneyflows"
              :key="moneyflow.id"
              :mmf="moneyflow"
            />
          </tbody>
        </table>
      </div>
    </td>
  </tr>
</template>
<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { formatNumber, redIfNegativeEnd } from "@/tools/views/FormatNumber";
import SearchMoneyflowResultRowVue from "./SearchMoneyflowResultRow.vue";
import { Routes } from "@/router";

type MoneyflowGroup = {
  month: number;
  monthString: string;
  year: number;
  contractpartnerName: string;
  amount: number;
  comment: Set<string>;
  commentString: string;
  moneyflows: Array<Moneyflow>;
};

export default defineComponent({
  name: "SearchMoneyflowResultGroup",
  data() {
    return {
      Routes: Routes,
      collapseIconClass: "bi bi-caret-right-fill",
      showDetails: false,
    };
  },
  props: {
    moneyflowGroupKey: {
      type: String,
      required: true,
    },
    moneyflowGroup: {
      type: Object as PropType<MoneyflowGroup>,
      required: true,
    },
    colBookingMonth: {
      type: Boolean,
      required: true,
    },
    colBookingYear: {
      type: Boolean,
      required: true,
    },
    colContractpartner: {
      type: Boolean,
      required: true,
    },
  },
  mounted() {
    document
      .getElementById("collapseResults" + this.moneyflowGroupKey)
      ?.addEventListener("show.bs.collapse", () => this.toggleButtonShow());
    document
      .getElementById("collapseResults" + this.moneyflowGroupKey)
      ?.addEventListener("hide.bs.collapse", () => this.toggleButtonHide());
  },
  computed: {
    amountClass(): string {
      return redIfNegativeEnd(this.moneyflowGroup.amount);
    },
    amountString(): string {
      return formatNumber(this.moneyflowGroup.amount, 2);
    },
  },
  methods: {
    toggleButtonShow() {
      this.collapseIconClass = "bi bi-caret-down-fill";
      this.showDetails = true;
    },
    toggleButtonHide() {
      this.collapseIconClass = "bi bi-caret-right-fill";
    },
  },
  components: { SearchMoneyflowResultRowVue },
});
</script>
