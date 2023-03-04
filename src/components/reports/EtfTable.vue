<template>
  <DivError :server-errors="serverErrors" />
  <div
    class="row justify-content-md-center py-4"
    v-if="dataLoaded && etfSummaryReceived"
  >
    <div class="col col-lg-8">
      <div class="card">
        <div class="card-header text-center p-3">
          <h4>{{ $t("ETF.etf") }}</h4>
        </div>
        <div class="card-body">
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
                    <th class="text-center" rowspan="2">{{ $t("ETF.etf") }}</th>
                    <th class="text-center" rowspan="2">
                      {{ $t("ETF.shares") }}
                    </th>
                    <th class="text-center" colspan="3">
                      {{ $t("ETF.amount") }}
                    </th>
                    <th class="text-center" colspan="3">
                      {{ $t("ETF.overall") }}
                    </th>
                    <th class="text-center" rowspan="2">
                      {{ $t("Reports.state") }}
                    </th>
                  </tr>
                  <tr>
                    <th class="text-center">{{ $t("ETF.payed") }} &#8709;</th>
                    <th class="text-center">{{ $t("ETF.bid") }}</th>
                    <th class="text-center">{{ $t("ETF.ask") }}</th>
                    <th class="text-center">{{ $t("ETF.payed") }}</th>
                    <th class="text-center">{{ $t("ETF.bid") }}</th>
                    <th class="text-center">{{ $t("ETF.profit") }}</th>
                  </tr>
                </thead>

                <tbody v-if="dataLoaded">
                  <EtfTableRowVue
                    v-for="etfData in etfSummaryArray"
                    :key="etfData.isin"
                    v-bind="etfData"
                  />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import EtfControllerHandler from "@/handler/EtfControllerHandler";
import type { EtfSummary } from "@/model/etf/EtfSummary";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { computed, onMounted, ref, watch } from "vue";
import DivError from "../DivError.vue";
import EtfTableRowVue from "./EtfTableRow.vue";

const serverErrors = ref(new Array<string>());

const etfSummaryArray = ref(new Array<EtfSummary>());
const dataLoaded = ref(false);

const props = defineProps({
  year: {
    type: String,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
});

const loadData = (year: number, month: number) => {
  serverErrors.value = new Array<string>();

  dataLoaded.value = false;
  EtfControllerHandler.listEtfOverview(year, month)
    .then((_etfSummeryArray) => {
      etfSummaryArray.value = _etfSummeryArray;
      dataLoaded.value = true;
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

onMounted(() => {
  loadData(+props.year, +props.month);
});

watch(
  () => ({
    year: props.year,
    month: props.month,
  }),
  (data) => {
    if (data.year && data.month) loadData(+data.year, +data.month);
  }
);

const etfSummaryReceived = computed(() => {
  return etfSummaryArray.value.length > 0;
});
</script>
