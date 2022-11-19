<template>
  <div class="text-center" style="margin-top: 20px">
    <form action="#">
      <table style="margin: 0 auto">
        <tr>
          <td class="text-right">
            <select
              class="form-control"
              v-model="selectedYear"
              @change="loadNewYear"
            >
              <option v-for="year in years" :key="year">
                {{ year }}
              </option>
            </select>
          </td>
          <td>
            <nav aria-label="Page navigation example" v-if="dataLoaded">
              <ul class="pagination">
                <li class="page-item" v-for="month in months" :key="month">
                  <router-link
                    class="page-link"
                    :to="{
                      name: Routes.ListReports,
                      params: { year: selectedYear, month: month },
                    }"
                  >
                    {{ getMonthName(month) }}
                  </router-link>
                </li>
              </ul>
            </nav>
          </td>
        </tr>
      </table>
    </form>
  </div>
</template>
<script lang="ts">
import ReportControllerHandler from "@/handler/ReportControllerHandler";
import { getMonthName } from "@/tools/views/MonthName";
import router, { Routes } from "@/router";
import { defineComponent } from "vue";
export default defineComponent({
  name: "BookListItem",
  data() {
    return {
      Routes: Routes,
      dataLoaded: false,
      months: [] as number[],
      years: [] as number[],
      selectedYear: this.$props.year,
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
    async loadData(year: string, month: string) {
      let getAvailableMonthResponse =
        await ReportControllerHandler.getAvailableMonth(+year, +month);
      this.months =
        getAvailableMonthResponse.getAvailableMonthResponse.allMonth;
      this.years = getAvailableMonthResponse.getAvailableMonthResponse.allYears;
      this.dataLoaded = true;
    },
    loadNewYear() {
      router.push({
        name: Routes.ListReports,
        params: { year: this.selectedYear, month: "1" },
      });
      this.loadData(this.selectedYear, "1");
    },
  },
});
</script>

<style scoped>
ul {
  margin: 0 !important;
}
</style>
