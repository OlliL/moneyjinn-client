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
        class="w-full rounded-lg border bg-card text-card-foreground shadow-sm p-4"
      >
        <form @submit.prevent="importImportedMoneyflow(importedMoneyflow)">
          <div class="space-y-3">
            <div
              class="grid gap-y-2 gap-x-4 grid-cols-6 md:grid-cols-12 items-center"
            >
              <div
                class="col-span-2 md:col-span-1 flex justify-start md:justify-end"
                style="font-weight: 700; font-size: 10.5px; line-height: 1"
              >
                {{ $t("General.iban") }}:
              </div>
              <div class="col-span-4 md:col-span-2 text-left">
                {{ importedMoneyflow.accountNumber }}
              </div>

              <div
                class="col-span-2 md:col-span-1 flex justify-start md:justify-end"
                style="font-weight: 700; font-size: 10.5px; line-height: 1"
              >
                {{ $t("General.bic") }}:
              </div>
              <div class="col-span-4 md:col-span-2 text-left">
                {{ importedMoneyflow.bankCode }}
              </div>

              <div
                class="col-span-2 md:col-span-2 flex justify-start md:justify-end"
                style="font-weight: 700; font-size: 10.5px; line-height: 1"
              >
                {{ $t("General.contractpartner") }}:
              </div>
              <div class="col-span-4 md:col-span-4 text-left">
                {{ importedMoneyflow.name }}
              </div>
            </div>

            <div
              class="grid gap-y-2 gap-x-4 grid-cols-6 md:grid-cols-12 items-center"
            >
              <div
                class="col-span-2 md:col-span-1 flex justify-start md:justify-end"
                style="font-weight: 700; font-size: 10.5px; line-height: 1"
              >
                {{ $t("Moneyflow.reference") }}:
              </div>
              <div class="col-span-4 md:col-span-11 text-left">
                {{ importedMoneyflow.usage }}
              </div>
            </div>
            <Separator class="mb-6 mt-6" />
            <EditMoneyflowBase
              :ref="(el) => editMoneyflowRefs.set(importedMoneyflow.id, el)"
              :mmf-to-edit="importedMoneyflow"
              :id-suffix="importedMoneyflow.id + ''"
              :fill-contractpartner-defaults="true"
            />
            <div class="flex flex-wrap items-center justify-center gap-2">
              <ButtonSubmit :button-label="$t('Moneyflow.apply')" />
              <Button
                type="button"
                variant="destructive"
                @click="deleteImportedMoneyflow(importedMoneyflow)"
              >
                {{ $t("General.delete") }}
              </Button>
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
import Separator from "@/components/ui/separator/Separator.vue";

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
