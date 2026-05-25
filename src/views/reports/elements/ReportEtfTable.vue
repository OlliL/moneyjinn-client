<template>
  <DivError :server-errors="serverErrors" />
  <div class="flex justify-center py-3" v-if="dataLoaded && etfSummaryReceived">
    <!-- Desktop View -->
    <div class="w-full max-w-7xl" v-if="isDesktop().value">
      <div class="rounded-sm border">
        <div class="border-b text-center p-3">
          <h4 class="text-2xl font-bold">{{ $t("General.etf") }}</h4>
        </div>
        <div class="p-4">
          <EtfTable :etf-summary-array="etfSummaryArray" />
        </div>
      </div>
    </div>

    <!-- Mobile View -->
    <div class="w-full max-w-md mx-auto px-2 mb-6" v-else>
      <Accordion type="single" collapsible class="w-full">
        <ReportEtfAccordion :etf-summary-array="etfSummaryArray" />
      </Accordion>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DivError from "@/components/common/DivError.vue";
import EtfTable from "@/components/etf/EtfTable.vue";
import { Accordion } from "@/components/ui/accordion";
import type { EtfSummary } from "@/model/etf/EtfSummary";
import EtfService from "@/service/EtfService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { isDesktop } from "@/tools/views/IsDesktop";
import { computed, onMounted, ref, watch } from "vue";
import ReportEtfAccordion from "./ReportEtfAccordion.vue";

const serverErrors = ref(new Array<string>());

const etfSummaryArray = ref(new Array<EtfSummary>());

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
const dataLoaded = defineModel({
  type: Boolean,
  required: true,
});

const loadData = (year: number, month: number) => {
  serverErrors.value = new Array<string>();

  dataLoaded.value = false;
  EtfService.listEtfOverview(year, month)
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
  },
);

const etfSummaryReceived = computed(() => {
  return etfSummaryArray.value.length > 0;
});
</script>
