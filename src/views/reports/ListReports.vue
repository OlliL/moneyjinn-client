<template>
  <div class="container-fluid text-center">
    <h4>Reports</h4>
    <div class="row" style="margin-top: 20px">
      <div class="col">
        <form action="#">
          <table style="margin: 0 auto">
            <tr>
              <td class="text-right pe-2">
                <select
                  class="form-control"
                  v-model="selectedYear"
                  @change="selectMonth(selectedYear + '')"
                >
                  <option v-for="year in years" :key="year">
                    {{ year }}
                  </option>
                </select>
              </td>
              <td>
                <nav aria-label="Page navigation example" v-if="dataLoaded">
                  <ul class="pagination month-selection">
                    <li class="page-item" v-for="month in months" :key="month">
                      <a
                        :class="
                          $props.month == month + ''
                            ? 'page-link active'
                            : 'page-link'
                        "
                        href="#"
                        @click="selectMonth($props.year, month + '')"
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
      <div class="col-sm text-start">
        <a
          class="page-link link-primary"
          href="#"
          @click="selectMonth(previousYear + '', previousMonth + '')"
          v-if="previousMonthLink"
          >&lt;&lt; voriger Monat</a
        >
      </div>
      <div class="col-sm text-end">
        <a
          class="page-link link-primary"
          href="#"
          @click="selectMonth(nextYear + '', nextMonth + '')"
          v-if="nextMonthLink"
          >n&auml;chster Monat &gt;&gt;</a
        >
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
  name: "MonthSelection",
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
      required: true,
    },
    month: {
      type: String,
      required: true,
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
    selectMonth(year: string, month?: string) {
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
