<template>
  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">{{ $t("Moneyflow.title.import") }}</h4>
    </div>

    <DivError :server-errors="serverErrors" />

    <div
      class="text-center text-green-600"
      v-if="dataLoaded && importMoneyflows.length == 0"
    >
      {{ $t("AppHome.allDone") }} <Smile class="inline h-4 w-4" />
    </div>
    <div
      class="flex justify-center pb-5"
      v-for="importedMoneyflow in importMoneyflows"
      :key="importedMoneyflow.externalid"
    >
      <div
        class="w-full rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden"
      >
        <form @submit.prevent="importImportedMoneyflow(importedMoneyflow)">
          <div class="grid grid-cols-1 lg:grid-cols-4 min-h-full">
            <div
              class="bg-muted/40 p-5 border-b lg:border-b-0 lg:border-r border-border/60 space-y-4"
            >
              <dl class="space-y-1">
                <dt
                  class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80"
                >
                  {{ $t("General.contractpartner") }}
                </dt>
                <dd class="font-semibold text-sm text-foreground break-words">
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
                  class="font-mono text-xs text-foreground bg-background/80 px-2 py-1 rounded border border-border/40 inline-block break-all"
                >
                  {{ importedMoneyflow.accountNumber }}
                </dd>
              </dl>

              <dl class="space-y-1">
                <dt
                  class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80"
                >
                  {{ $t("General.bic") }}
                </dt>
                <dd
                  class="font-mono text-xs text-foreground bg-background/80 px-2 py-1 rounded border border-border/40 inline-block"
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
                :ref="(el) => editMoneyflowRefs.set(importedMoneyflow.id, el)"
                :mmf-to-edit="importedMoneyflow"
                :id-suffix="importedMoneyflow.id + ''"
                :fill-contractpartner-defaults="true"
              />

              <div
                class="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-border/40"
              >
                <ButtonSubmit
                  :button-label="$t('Moneyflow.apply')"
                  class="px-6"
                />
                <Button
                  type="button"
                  variant="destructive"
                  class="px-6"
                  @click="deleteImportedMoneyflow(importedMoneyflow)"
                >
                  {{ $t("General.delete") }}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";

import ButtonSubmit from "@/components/ButtonSubmit.vue";
import EditMoneyflowBase from "@/components/moneyflow/EditMoneyflowBase.vue";

import type { ImportedMoneyflow } from "@/model/moneyflow/ImportedMoneyflow";

import ImportedMoneyflowService from "@/service/ImportedMoneyflowService";
import DivError from "@/components/DivError.vue";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { Smile } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import SpanImportComment from "@/components/SpanImportComment.vue";

const serverErrors = ref(new Array<string>());

const importMoneyflows = ref({} as Array<ImportedMoneyflow>);
const editMoneyflowRefs = new Map<number, any>();
const dataLoaded = ref(false);

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
