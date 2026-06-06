<template>
  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">{{ $t("Moneyflow.title.import") }}</h4>
    </div>

    <DivError :server-errors="serverErrors" />

    <div
      class="flex justify-center"
      v-if="dataLoaded && importMoneyflows.length == 0"
    >
      <Alert
        class="max-w-xl border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900"
      >
        <CheckCircle2 />
        <AlertTitle>
          {{ $t("AppHome.allDone") }}
        </AlertTitle>
      </Alert>
    </div>

    <div class="space-y-4">
      <!-- Desktop View -->
      <template v-if="desktop">
        <div
          class="flex justify-center pb-5"
          v-for="importedMoneyflow in importMoneyflows"
          :key="'desktop-' + importedMoneyflow.externalid"
        >
          <ImportMoneyflowsDesktop
            :imported-moneyflow="importedMoneyflow"
            @item-removed="onItemRemoved"
          />
        </div>
      </template>

      <!-- Mobile View -->
      <template v-else>
        <Accordion
          type="single"
          collapsible
          class="w-full space-y-3 pb-4"
          v-model="openAccordionItem"
        >
          <ImportMoneyflowsMobile
            v-for="importedMoneyflow in importMoneyflows"
            :key="'mobile-' + importedMoneyflow.externalid"
            :imported-moneyflow="importedMoneyflow"
            :is-open="openAccordionItem === importedMoneyflow.externalid"
            @item-removed="onItemRemoved"
          />
        </Accordion>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { ImportedMoneyflow } from "@/model/moneyflow/ImportedMoneyflow";
import { onMounted, ref } from "vue";

import { Accordion } from "@/components/ui/accordion";
import Alert from "@/components/ui/alert/Alert.vue";
import AlertTitle from "@/components/ui/alert/AlertTitle.vue";
import ImportedMoneyflowService from "@/service/ImportedMoneyflowService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { isDesktop } from "@/tools/views/IsDesktop";
import { CheckCircle2 } from "lucide-vue-next";

import DivError from "@/components/common/DivError.vue";
import ImportMoneyflowsDesktop from "./elements/ImportMoneyflowsDesktop.vue";
import ImportMoneyflowsMobile from "./elements/ImportMoneyflowsMobile.vue";

const serverErrors = ref(new Array<string>());

const importMoneyflows = ref<ImportedMoneyflow[]>([]);
const dataLoaded = ref(false);
const desktop = isDesktop();
const openAccordionItem = ref("");

onMounted(() => {
  dataLoaded.value = false;
  ImportedMoneyflowService.showAddImportedMoneyflows()
    .then((imf) => {
      importMoneyflows.value = imf;
      dataLoaded.value = true;
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
});

const onItemRemoved = (id: number) =>
  (importMoneyflows.value = importMoneyflows.value.filter(
    (entry) => entry.id !== id,
  ));
</script>
