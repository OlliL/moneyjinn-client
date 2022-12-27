<template>
  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>Reports</h4>
      </div>
    </div>
    <div class="row justify-content-md-center mb-4">
      <div class="col">
        <form action="#">
          <table style="margin: 0 auto">
            <tr>
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
                          $props.month == month + ''
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
    <div class="row">
      <div
        class="col-md-3 text-start g-0"
        style="position: fixed; z-index: 1030; margin-top: 35vh"
      >
        <h1>
          <i
            role="button"
            @click="navigateToPreviousMonth"
            v-if="previousMonthLink"
            class="bi bi-caret-left-fill link-primary"
          ></i>
        </h1>
      </div>
      <div
        class="col-md-3 text-end g-0 offset-md-9"
        style="position: fixed; z-index: 1030; margin-top: 35vh"
      >
        <h1>
          <i
            role="button"
            @click="navigateToNextMonth"
            v-if="nextMonthLink"
            class="bi bi-caret-right-fill link-primary"
          ></i>
        </h1>
      </div>
    </div>
    <ReportTableVue :year="year" :month="month" v-if="year && month" />
    <EtfTableVue :year="year" :month="month" v-if="year && month" />
  </div>
</template>

<script lang="ts">
import ReportTableVue from "@/components/reports/ReportTable.vue";
import EtfTableVue from "@/components/reports/EtfTable.vue";
import ReportControllerHandler from "@/handler/ReportControllerHandler";
import { getMonthName } from "@/tools/views/MonthName";
import router, { Routes } from "@/router";
import { defineComponent } from "vue";
export default defineComponent({
  name: "ListReports",
  data() {
    return {
      Routes: Routes,
      dataLoaded: false,
      months: [] as number[],
      years: [] as number[],
      previousMonth: 0,
      previousYear: 0,
      nextMonth: 0,
      nextYear: 0,
      previousMonthLink: false,
      nextMonthLink: false,
      selectedYear: 0,
    };
  },
  props: {
    year: {
      type: String,
      default: "",
    },
    month: {
      type: String,
      default: "",
    },
  },
  created() {
    this.loadData(this.$props.year, this.$props.month);
  },
  methods: {
    getMonthName(month: number): string {
      return getMonthName(month);
    },
    async loadData(year?: string, month?: string) {
      this.dataLoaded = false;
      let response = await ReportControllerHandler.getAvailableMonth(
        year,
        month
      );
      this.months = response.allMonth;
      this.years = response.allYears;

      this.previousMonth = response.previousMonth;
      this.previousMonthLink = response.previousMonthHasMoneyflows === 1;
      this.previousYear = response.previousYear;

      this.nextMonth = response.nextMonth;
      this.nextMonthLink = response.nextMonthHasMoneyflows === 1;
      this.nextYear = response.nextYear;

      this.selectedYear = response.year;

      this.dataLoaded = true;
    },
    navigateToPreviousMonth() {
      this.selectMonth(this.previousYear + "", this.previousMonth + "");
    },
    navigateToNextMonth() {
      this.selectMonth(this.nextYear + "", this.nextMonth + "");
    },
    selectMonth(year: string, month?: string) {
      this.dataLoaded = false;
      router.push({
        name: Routes.ListReports,
        params: { year: year, month: month },
      });
      this.loadData(year, month);
    },
  },
  components: { ReportTableVue, EtfTableVue },
});
</script>

<style>
ul.month-selection {
  margin: 0 !important;
}
</style>
