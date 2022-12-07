<template>
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
        <td :class="mms.amountClass">{{ mms.amountString }} &euro;</td>
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
        <td :class="mms.amountClass">{{ mms.amountString }} &euro;</td>
      </tr>
      <tr>
        <td class="text-end">&sum;</td>
        <td :class="monthlySettlementCreditSumClass">
          <u>{{ monthlySettlementCreditSumString }} &euro;</u>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import MonthlySettlementControllerHandler from "@/handler/MonthlySettlementControllerHandler";
import type { MonthlySettlement } from "@/model/monthlysettlement/MonthlySettlement";
import { getMonthName } from "@/tools/views/MonthName";
import { defineComponent } from "vue";
import { formatNumber, redIfNegativeEnd } from "@/tools/views/FormatNumber";
import { CapitalsourceType } from "@/model/capitalsource/CapitalsourceType";

type MonthlySettlementData = MonthlySettlement & {
  amountClass: string;
  amountString: string;
};

export default defineComponent({
  name: "ShowMonthlySettlement",
  data() {
    return {
      dataLoaded: false,
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
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
  },
  watch: {
    month: {
      handler(newVal: number, oldVal: number) {
        if (newVal != oldVal)
          this.loadMonthlySettlements(this.$props.year, newVal);
      },
      immediate: true,
    },
  },
  created() {
    this.loadMonthlySettlements(this.$props.year, this.$props.month);
  },
  computed: {
    monthName(): string {
      return getMonthName(this.$props.month);
    },
  },
  methods: {
    getMonthName(month: number): string {
      return getMonthName(month);
    },
    async loadMonthlySettlements(year: number, month: number) {
      const monthlySettlements: Array<MonthlySettlement> =
        await MonthlySettlementControllerHandler.getMonthlySettlementList(
          year,
          month
        );

      const monthlySettlementsCredit = new Array<MonthlySettlementData>();
      const monthlySettlementsNoCredit = new Array<MonthlySettlementData>();
      let monthlySettlementNoCreditSum = 0;
      let monthlySettlementCreditSum = 0;

      for (let mms of monthlySettlements) {
        const data: MonthlySettlementData = {
          ...mms,
          amountClass: redIfNegativeEnd(mms.amount),
          amountString: formatNumber(mms.amount, 2),
        };
        if (mms.capitalsourceType === CapitalsourceType.CREDIT) {
          monthlySettlementsCredit.push(data);
          monthlySettlementCreditSum += mms.amount;
        } else {
          monthlySettlementsNoCredit.push(data);
          monthlySettlementNoCreditSum += mms.amount;
        }

        this.monthlySettlementsCredit = monthlySettlementsCredit;
        this.monthlySettlementsNoCredit = monthlySettlementsNoCredit;

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
        this.dataLoaded = true;
      }
    },
  },
  components: {},
});
</script>

<style>
ul.month-selection {
  margin: 0 !important;
}
</style>
