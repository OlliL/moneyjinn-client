<template>
  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>Monatsabschl&uuml;sse</h4>
      </div>
    </div>
    <div class="row justify-content-md-center mb-4">
      <div class="col-md-9 col-xs-12">
        <form action="#">
          <table style="margin: 0 auto">
            <tr>
              <td class="text-right pe-2">
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="showCreateMonthlySettlementModal"
                >
                  Neu
                </button>
              </td>

              <td class="text-right pe-2">
                <select
                  class="form-select"
                  v-model="selectedYear"
                  @change="selectMonth(selectedYear + '')"
                >
                  <option v-for="year in years" :key="year">
                    {{ year }}
                  </option>
                </select>
              </td>
              <td>
                <nav aria-label="Month navigation" v-if="dataLoaded">
                  <ul class="pagination month-selection">
                    <li class="page-item" v-for="month in months" :key="month">
                      <a
                        :class="
                          $props.month === month + ''
                            ? 'page-link active'
                            : 'page-link'
                        "
                        href="#"
                        @click="selectMonth(selectedYear + '', month + '')"
                        >{{ getMonthName(month) }}</a
                      >
                    </li>
                  </ul>
                </nav>
              </td>
            </tr>
          </table>
        </form>
      </div>
    </div>
    <!---->
    <div class="row justify-content-md-center" v-if="selectedMonth">
      <div class="col-md-4 col-xs-12">
        <div class="card">
          <div class="card-header text-center p-3">
            <h5>Geldbewegung {{ monthName }} {{ year }}</h5>
          </div>
          <div class="card-body">
            <table class="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>Kapitalquelle</th>
                  <th>Betrag</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!---->
  </div>
</template>

<script lang="ts">
import MonthlySettlementControllerHandler from "@/handler/MonthlySettlementControllerHandler";
import { getMonthName } from "@/tools/views/MonthName";
import router, { Routes } from "@/router";
import { defineComponent } from "vue";
export default defineComponent({
  name: "ListMonthlySettlements",
  data() {
    return {
      Routes: Routes,
      dataLoaded: false,
      months: [] as number[],
      years: [] as number[],
      selectedYear: 0,
      selectedMonth: 0,
    };
  },
  props: {
    year: {
      type: String,
      default: undefined,
    },
    month: {
      type: String,
      default: undefined,
    },
  },
  created() {
    const year: number | undefined = this.$props.year
      ? +this.$props.year
      : undefined;
    const month: number | undefined = this.$props.month
      ? +this.$props.month
      : undefined;

    this.loadMonth(year, month);
    if (year !== undefined && month !== undefined)
      this.loadMontlySettlements(year, month);
  },
  computed: {
    monthName(): string {
      return getMonthName(this.selectedMonth);
    },
  },
  methods: {
    getMonthName(month: number): string {
      return getMonthName(month);
    },
    async loadMonth(year?: number, month?: number) {
      let response = await MonthlySettlementControllerHandler.getAvailableMonth(
        year,
        month
      );
      this.months = response.allMonth;
      this.years = response.allYears;

      this.selectedYear = response.year;
      this.selectedMonth = response.month;
      console.log(response);
      console.log(month);
      this.dataLoaded = true;
    },
    loadMontlySettlements(year: number, month: number) {},
    selectMonth(year: string, month?: string) {
      router.push({
        name: Routes.ListMonthlySettlements,
        params: { year: year, month: month },
      });
      if (this.$props.year + "" != year) this.loadMonth(+year);
      if (month) this.selectedMonth = +month;
      console.log(this.selectedMonth);
    },
    showCreateMonthlySettlementModal() {},
  },
  components: {},
});
</script>

<style>
ul.month-selection {
  margin: 0 !important;
}
</style>
