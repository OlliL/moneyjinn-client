<template>
  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">{{ $t("Moneyflow.title.import") }}</h4>
    </div>

    <DivError :server-errors="serverErrors" />

    <div class="flex justify-center">
      <Alert
        v-if="dataLoaded && importMoneyflows.length == 0"
        class="max-w-xl border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900"
      >
        <CheckCircle2 />
        <AlertTitle>
          {{ $t("AppHome.allDoneTitle") }}
        </AlertTitle>
        <AlertDescription>
          {{ $t("AppHome.allDone") }}
        </AlertDescription>
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
          <div
            class="w-full rounded-sm border bg-card text-card-foreground overflow-hidden"
          >
            <form @submit.prevent="importImportedMoneyflow(importedMoneyflow)">
              <div class="grid grid-cols-1 lg:grid-cols-4 min-h-full">
                <div
                  class="bg-muted/40 p-5 border-b lg:border-b-0 lg:border-r border-border/60 space-y-4 text-left"
                >
                  <dl class="space-y-1">
                    <dt
                      class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80"
                    >
                      {{ $t("General.contractpartner") }}
                    </dt>
                    <dd
                      class="text-sm text-foreground bg-background/80 px-2 py-1 rounded border border-border/40 inline-block font-semibold"
                    >
                      {{ importedMoneyflow.name }}
                    </dd>
                  </dl>

                  <dl class="space-y-1">
                    <dt
                      class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80"
                    >
                      {{ $t("General.iban") }}
                    </dt>
                    <dd
                      class="text-xs text-foreground bg-background/80 px-2 py-1 rounded border border-border/40 inline-block break-all"
                    >
                      <SpanIban :iban="importedMoneyflow.accountNumber" />
                    </dd>
                  </dl>

                  <dl class="space-y-1">
                    <dt
                      class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80"
                    >
                      {{ $t("General.bic") }}
                    </dt>
                    <dd
                      class="text-xs text-foreground bg-background/80 px-2 py-1 rounded border border-border/40 inline-block"
                    >
                      {{ importedMoneyflow.bankCode }}
                    </dd>
                  </dl>

                  <dl class="space-y-1 pt-2 border-t border-border/40">
                    <dt
                      class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-1"
                    >
                      {{ $t("Moneyflow.reference") }}
                    </dt>
                    <dd
                      class="text-xs text-foreground/90 bg-background/60 p-2.5 rounded border border-border/40 leading-relaxed max-h-40 overflow-y-auto backdrop-blur-sm"
                    >
                      <SpanImportComment :comment="importedMoneyflow.usage" />
                    </dd>
                  </dl>
                </div>

                <div
                  class="lg:col-span-3 p-6 space-y-6 flex flex-col justify-between"
                >
                  <EditMoneyflowBase
                    :ref="
                      (el) => editMoneyflowRefs.set(importedMoneyflow.id, el)
                    "
                    :mmf-to-edit="importedMoneyflow"
                    :id-suffix="importedMoneyflow.id + ''"
                    :fill-contractpartner-defaults="true"
                  />

                  <div
                    class="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-border/40"
                  >
                    <Button
                      type="button"
                      variant="destructive"
                      class="flex items-center gap-2 px-6"
                      @click="deleteImportedMoneyflow(importedMoneyflow)"
                    >
                      <Trash2 class="icon-medium" />
                      {{ $t("General.delete") }}
                    </Button>
                    <ButtonSubmit
                      :button-label="$t('Moneyflow.apply')"
                      class="px-6"
                      ><template #icon><Save class="icon-medium" /></template
                    ></ButtonSubmit>
                  </div>
                </div>
              </div>
            </form>
          </div>
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
            :ref="(el) => editMoneyflowRefs.set(importedMoneyflow.id, el)"
            @import="importImportedMoneyflow(importedMoneyflow)"
            @delete="deleteImportedMoneyflow(importedMoneyflow)"
            :is-open="openAccordionItem === importedMoneyflow.externalid"
          />
        </Accordion>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";

import ButtonSubmit from "@/components/common/ButtonSubmit.vue";
import EditMoneyflowBase from "@/components/moneyflow/EditMoneyflowBase.vue";

import type { ImportedMoneyflow } from "@/model/moneyflow/ImportedMoneyflow";

import DivError from "@/components/common/DivError.vue";
import SpanIban from "@/components/common/SpanIban.vue";
import SpanImportComment from "@/components/common/SpanImportComment.vue";

import { Accordion } from "@/components/ui/accordion";
import Alert from "@/components/ui/alert/Alert.vue";
import AlertDescription from "@/components/ui/alert/AlertDescription.vue";
import AlertTitle from "@/components/ui/alert/AlertTitle.vue";
import { Button } from "@/components/ui/button";
import ImportedMoneyflowService from "@/service/ImportedMoneyflowService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { isDesktop } from "@/tools/views/IsDesktop";
import { CheckCircle2, Save, Trash2 } from "lucide-vue-next";
import ImportMoneyflowsMobile from "./elements/ImportMoneyflowsMobile.vue";

const serverErrors = ref(new Array<string>());

const importMoneyflows = ref({} as Array<ImportedMoneyflow>);
const editMoneyflowRefs = new Map<number, any>();
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

const deleteImportedMoneyflow = (mim: ImportedMoneyflow) => {
  editMoneyflowRefs
    .get(mim.id)
    .deleteImportedMoneyflow(mim.id)
    .then((res: boolean) => {
      if (res) {
        importMoneyflows.value = importMoneyflows.value.filter(
          (entry) => entry.id !== mim.id,
        );
      }
    });
};
const importImportedMoneyflow = (mim: ImportedMoneyflow) => {
  editMoneyflowRefs
    .get(mim.id)
    .importImportedMoneyflow(mim)
    .then((res: boolean) => {
      if (res) {
        importMoneyflows.value = importMoneyflows.value.filter(
          (entry) => entry.id !== mim.id,
        );
      }
    });
};
</script>
