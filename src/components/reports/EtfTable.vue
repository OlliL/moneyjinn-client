<template>
  <div class="row justify-content-md-center">
    <div class="col col-lg-8">
      <div class="panel panel-default">
        <div class="panel-heading text-center">
          <h4>ETF</h4>
        </div>
        <div class="panel-body">
          <div class="row">
            <div class="col-xs-12 text-center">
              <table
                class="table table-striped table-bordered table-hover"
                style="table-layout: fixed"
              >
                <col style="width: 26%" />
                <col style="width: 6%" />
                <col style="width: 9%" />
                <col style="width: 9%" />
                <col style="width: 9%" />
                <col style="width: 9%" />
                <col style="width: 9%" />
                <col style="width: 9%" />
                <col style="width: 14%" />
                <thead>
                  <tr>
                    <th class="text-center" rowspan="2">Name</th>
                    <th class="text-center" rowspan="2">Anteile</th>
                    <th class="text-center" colspan="3">St&uuml;ck</th>
                    <th class="text-center" colspan="3">Gesamt</th>
                    <th class="text-center" rowspan="2">Stand</th>
                  </tr>
                  <tr>
                    <th class="text-center">Bezahlt &#8709;</th>
                    <th class="text-center">Verkauf</th>
                    <th class="text-center">Einkauf</th>
                    <th class="text-center">Bezahlt</th>
                    <th class="text-center">Verkauf</th>
                    <th class="text-center">Gewinn</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td class="text-left">
                      <a :href="chartUrl">{{ name }}</a>
                    </td>
                    <td class="text-right">{{ amount }}</td>
                    <td class="text-right of_number_to_be_evaluated">
                      {{ avgSpentPriceString }} &euro;
                    </td>
                    <td class="text-right of_number_to_be_evaluated">
                      {{ sellPriceString }} &euro;
                    </td>
                    <td class="text-right of_number_to_be_evaluated">
                      {{ buyPriceString }} &euro;
                    </td>
                    <td class="text-right of_number_to_be_evaluated">
                      {{ spentValueString }} &euro;
                    </td>
                    <td class="text-right of_number_to_be_evaluated">
                      {{ sumSellPriceString }} &euro;
                    </td>
                    <td class="text-right of_number_to_be_evaluated">
                      <u>{{ profitString }} &euro;</u>
                    </td>
                    <td class="text-right">{{ pricesTimestampString }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import EtfControllerHandler from "@/handler/EtfControllerHandler";
import { defineComponent } from "vue";
export default defineComponent({
  name: "EtfTable",
  data() {
    return {
      isin: "",
      name: "",
      chartUrl: "",
      amount: 0,
      spentValue: 0,
      buyPrice: 0,
      sellPrice: 0,
      pricesTimestamp: "",
      dataLoaded: false,
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
  computed: {
    sumSellPrice(): number {
      return this.amount * this.sellPrice;
    },
    sumSellPriceString(): string {
      if (this.dataLoaded) {
        return new Intl.NumberFormat("de-DE", {
          style: "decimal",
          useGrouping: true,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(this.sumSellPrice);
      }
      return "";
    },
    avgSpentPriceString(): string {
      if (this.dataLoaded) {
        return new Intl.NumberFormat("de-DE", {
          style: "decimal",
          useGrouping: true,
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }).format(this.spentValue / this.amount);
      }
      return "";
    },
    profitString(): string {
      if (this.dataLoaded) {
        return new Intl.NumberFormat("de-DE", {
          style: "decimal",
          useGrouping: true,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(this.sumSellPrice - this.spentValue);
      }
      return "";
    },
    sellPriceString(): string {
      if (this.dataLoaded) {
        return new Intl.NumberFormat("de-DE", {
          style: "decimal",
          useGrouping: true,
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        }).format(this.sellPrice);
      }
      return "";
    },
    buyPriceString(): string {
      if (this.dataLoaded) {
        return new Intl.NumberFormat("de-DE", {
          style: "decimal",
          useGrouping: true,
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        }).format(this.buyPrice);
      }
      return "";
    },
    spentValueString(): string {
      if (this.dataLoaded) {
        return new Intl.NumberFormat("de-DE", {
          style: "decimal",
          useGrouping: true,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(this.spentValue);
      }
      return "";
    },
    pricesTimestampString(): string {
      if (this.dataLoaded) {
        const dateObj = new Date(this.pricesTimestamp);
        //avoid comma between date and time
        const date = new Intl.DateTimeFormat("default", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(dateObj);
        const time = new Intl.DateTimeFormat("default", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(dateObj);
        return date + " " + time;
      }
      return "";
    },
  },
  created() {
    this.loadData(this.$props.year, this.$props.month);
    this.$watch(
      () => ({
        year: this.year,
        month: this.month,
      }),
      (data) => {
        if (data.year && data.month) this.loadData(data.year, data.month);
      }
    );
  },
  methods: {
    async loadData(year: string, month: string) {
      let listEtfOverviewResponse = await EtfControllerHandler.listEtfOverview(
        year,
        month
      );

      const response =
        listEtfOverviewResponse.listEtfOverviewResponse.etfSummaryTransport[0];
      this.isin = response.isin;
      this.name = response.name;
      this.chartUrl = response.chartUrl;
      this.amount = response.amount;
      this.spentValue = response.spentValue;
      this.buyPrice = response.buyPrice;
      this.sellPrice = response.sellPrice;
      this.pricesTimestamp = response.pricesTimestamp;
      this.dataLoaded = true;

      console.log(response);
    },
  },
});
</script>
