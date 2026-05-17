<template>
  <ModalVue
    :title="$t('ETFPreliminaryLumpSum.title.delete')"
    ref="modalComponent"
  >
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="flex flex-col rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableBody>
            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("General.etf") }}
              </TableCell>
              <TableCell class="font-medium text-foreground pr-4 py-3">
                {{ etfName }}
              </TableCell>
            </TableRow>

            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("General.year") }}
              </TableCell>
              <TableCell
                class="font-semibold text-foreground pr-4 py-3 text-base"
              >
                {{ etfPreliminaryLumpSum.year }}
              </TableCell>
            </TableRow>

            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("ETFPreliminaryLumpSum.yearlySum") }}
              </TableCell>
              <TableCell class="font-medium text-foreground pr-4 py-3">
                <SpanAmount :amount="etfPreliminaryLumpSum.amountDecember" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </template>
    <template #footer>
      <Button
        variant="destructive"
        class="flex items-center gap-2 px-6"
        @click="deleteEtfPreliminaryLumpSum"
      >
        <Trash2 />
        {{ $t("General.delete") }}
      </Button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { Trash2 } from "lucide-vue-next";
import { computed, ref, useTemplateRef } from "vue";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";
import SpanAmount from "../SpanAmount.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";

import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";

import CrudEtfPreliminaryLumpSumService from "@/service/CrudEtfPreliminaryLumpSumService";
import { useEtfStore } from "@/stores/EtfStore";

const serverErrors = ref(new Array<string>());

const etfPreliminaryLumpSum = ref({} as EtfPreliminaryLumpSum);
const etfName = computed(() => {
  return etfStore.getEtf(etfPreliminaryLumpSum.value.etfId)?.name ?? "";
});
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");
const emit = defineEmits(["etfPreliminaryLumpSumDeleted"]);
const etfStore = useEtfStore();

const _show = (_mep: EtfPreliminaryLumpSum) => {
  serverErrors.value = new Array<string>();
  etfPreliminaryLumpSum.value = _mep;
  modalComponent.value?._show();
};
const deleteEtfPreliminaryLumpSum = () => {
  serverErrors.value = new Array<string>();

  CrudEtfPreliminaryLumpSumService.deleteEtfPreliminaryLumpSum(
    etfPreliminaryLumpSum.value.id,
  )
    .then(() => {
      modalComponent.value?._hide();
      emit("etfPreliminaryLumpSumDeleted", etfPreliminaryLumpSum.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

defineExpose({ _show });
</script>
