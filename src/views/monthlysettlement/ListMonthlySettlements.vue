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
    <div class="row justify-content-md-center mb-4" v-if="selectedMonth">
      <div class="col-md-4 col-xs-12">
        <div class="card">
          <div class="card-header text-center p-3">
            <h5>Geldbewegung {{ monthName }} {{ year }}</h5>
          </div>
          <div class="card-body">
            <table
              class="table table-striped table-bordered table-hover"
              v-if="monthlySettlementsNoCredit"
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
                  <td :class="mms.amountClass">
                    {{ mms.amountString }} &euro;
                  </td>
                </tr>
                <tr>
                  <td class="text-end">&sum;</td>
                  <td :class="monthlySettlementNoCreditSumClass">
                    <u>{{ monthlySettlementNoCreditSumString }} &euro;</u>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              class="table table-striped table-bordered table-hover"
              v-if="monthlySettlementsCredit"
            >
              <col style="width: 70%" />
              <col style="width: 30%" />
              <thead v-if="!monthlySettlementsNoCredit">
                <tr>
                  <th>Kapitalquelle</th>
                  <th>Betrag</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="mms in monthlySettlementsCredit" :key="mms.id">
                  <td class="text-start">{{ mms.capitalsourceComment }}</td>
                  <td :class="mms.amountClass">
                    {{ mms.amountString }} &euro;
                  </td>
                </tr>
                <tr>
                  <td class="text-end">&sum;</td>
                  <td :class="monthlySettlementCreditSumClass">
                    <u>{{ monthlySettlementCreditSumString }} &euro;</u>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-content-md-center mb-4" v-if="selectedMonth">
      <div class="col-md-4 col-xs-12">
        <button
          type="button"
          class="btn btn-primary mx-2"
          @click="showEditMonthlySettlementModal"
        >
          Bearbeiten
        </button>
        <button
          type="button"
          class="btn btn-danger mx-2"
          @click="showDeleteMonthlySettlementModal"
        >
          L&ouml;schen
        </button>
      </div>
    </div>
    <!---->
  </div>
</template>

<script lang="ts">
import MonthlySettlementControllerHandler from "@/handler/MonthlySettlementControllerHandler";
import type { MonthlySettlement } from "@/model/monthlysettlement/MonthlySettlement";
import { getMonthName } from "@/tools/views/MonthName";
import router, { Routes } from "@/router";
import { defineComponent } from "vue";
import { formatNumber, redIfNegativeEnd } from "@/tools/views/FormatNumber";
import { CapitalsourceType } from "@/model/capitalsource/CapitalsourceType";

type MonthlySettlementData = MonthlySettlement & {
  amountClass: string;
  amountString: string;
};

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
      monthlySettlementsNoCredit: {} as Array<MonthlySettlementData>,
      monthlySettlementsCredit: {} as Array<MonthlySettlementData>,
      monthlySettlementNoCreditSumClass: "",
      monthlySettlementNoCreditSumString: "",
      monthlySettlementCreditSumClass: "",
      monthlySettlementCreditSumString: "",
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
      this.loadMonthlySettlements(year, month);
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

      this.dataLoaded = true;
    },
    async loadMonthlySettlements(year: number, month: number) {
      this.monthlySettlementsCredit = new Array<MonthlySettlementData>();
      this.monthlySettlementsNoCredit = new Array<MonthlySettlementData>();

      const monthlySettlements: Array<MonthlySettlement> =
        await MonthlySettlementControllerHandler.getMonthlySettlementList(
          year,
          month
        );

      let monthlySettlementNoCreditSum = 0;
      let monthlySettlementCreditSum = 0;

      for (let mms of monthlySettlements) {
        const data: MonthlySettlementData = {
          ...mms,
          amountClass: redIfNegativeEnd(mms.amount),
          amountString: formatNumber(mms.amount, 2),
        };
        if (mms.capitalsourceType === CapitalsourceType.CREDIT) {
          this.monthlySettlementsCredit.push(data);
          monthlySettlementCreditSum += mms.amount;
        } else {
          this.monthlySettlementsNoCredit.push(data);
          monthlySettlementNoCreditSum += mms.amount;
        }

        this.monthlySettlementNoCreditSumClass = redIfNegativeEnd(
          monthlySettlementNoCreditSum
        );
        this.monthlySettlementNoCreditSumString = formatNumber(
          monthlySettlementNoCreditSum,
          2
        );
        this.monthlySettlementCreditSumClass = redIfNegativeEnd(
          monthlySettlementCreditSum
        );
        this.monthlySettlementCreditSumString = formatNumber(
          monthlySettlementCreditSum,
          2
        );
      }
    },
    selectMonth(year: string, month?: string) {
      router.push({
        name: Routes.ListMonthlySettlements,
        params: { year: year, month: month },
      });
      if (this.$props.year + "" != year) this.loadMonth(+year);
      if (month) this.selectedMonth = +month;
    },
    showCreateMonthlySettlementModal() {},
    showEditMonthlySettlementModal() {},
    showDeleteMonthlySettlementModal() {},
  },
  components: {},
});
</script>

<style>
ul.month-selection {
  margin: 0 !important;
}
</style>
