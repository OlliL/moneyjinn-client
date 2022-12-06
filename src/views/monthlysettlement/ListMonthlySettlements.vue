<template>
  <div class="container-fluid text-center">
    <h4>Monatsabschl&uuml;sse</h4>
    <div class="row justify-content-md-center mb-4" style="margin-top: 20px">
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
    <!-- conten vue here -->
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
      let response = await MonthlySettlementControllerHandler.getAvailableMonth(
        year,
        month
      );
      this.months = response.allMonth;
      this.years = response.allYears;

      this.selectedYear = response.year;

      this.dataLoaded = true;
    },
    selectMonth(year: string, month?: string) {
      router.push({
        name: Routes.ListMonthlySettlements,
        params: { year: year, month: month },
      });
      this.loadData(year, month);
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
