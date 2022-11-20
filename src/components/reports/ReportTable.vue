<template>
  <div class="row" style="margin-top: 20px">
    <div class="col">{{ $props.year }} / {{ $props.month }}</div>
  </div>
  <CapitalsourceTableVue
    :capitalsource-data="assetsTurnoverCapitalsources"
    groupName="Eigenkapital"
    v-if="assetsTurnoverCapitalsources.length > 0"
  />
  <CapitalsourceTableVue
    :capitalsource-data="liabilitiesTurnoverCapitalsources"
    groupName="Fremdkapital"
    v-if="liabilitiesTurnoverCapitalsources.length > 0"
  />
  <CapitalsourceTableVue
    :capitalsource-data="creditTurnoverCapitalsources"
    groupName="Kredite"
    v-if="creditTurnoverCapitalsources.length > 0"
  />
</template>

<script lang="ts">
import ReportControllerHandler from "@/handler/ReportControllerHandler";
import type { Report } from "@/model/report/Report";
import { CapitalsourceType } from "@/model/capitalsource/CapitalsourceType";
import type { ReportTurnoverCapitalsource } from "@/model/report/ReportTurnoverCapitalsourceTransport";
import { defineComponent } from "vue";
import CapitalsourceTableVue from "./CapitalsourceTable.vue";
export default defineComponent({
  name: "ReportTable",
  data() {
    return { report: {} as Report, dataLoaded: false };
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
  computed: {
    assetsTurnoverCapitalsources(): Array<ReportTurnoverCapitalsource> {
      if (this.dataLoaded) {
        return this.report.reportTurnoverCapitalsources?.filter(
          (data) =>
            data.capitalsourceType === CapitalsourceType.CURRENT_ASSET ||
            data.capitalsourceType === CapitalsourceType.LONG_TERM_ASSET
        );
      }
      return new Array<ReportTurnoverCapitalsource>();
    },
    liabilitiesTurnoverCapitalsources(): Array<ReportTurnoverCapitalsource> {
      if (this.dataLoaded) {
        return this.report.reportTurnoverCapitalsources?.filter(
          (data) =>
            data.capitalsourceType === CapitalsourceType.RESERVE_ASSET ||
            data.capitalsourceType === CapitalsourceType.PROVISION_ASSET
        );
      }
      return new Array<ReportTurnoverCapitalsource>();
    },
    creditTurnoverCapitalsources(): Array<ReportTurnoverCapitalsource> {
      if (this.dataLoaded) {
        return this.report.reportTurnoverCapitalsources?.filter(
          (data) => data.capitalsourceType === CapitalsourceType.CREDIT
        );
      }
      return new Array<ReportTurnoverCapitalsource>();
    },
  },
  methods: {
    async loadData(year: string, month: string) {
      this.report = await ReportControllerHandler.listReports(year, month);
      this.dataLoaded = true;
      console.log(this.report);
    },
  },
  components: { CapitalsourceTableVue },
});
</script>
