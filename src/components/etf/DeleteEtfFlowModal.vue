<template>
  <ModalVue :title="$t('ETFFlow.title.delete')" ref="modalComponent">
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
                {{ $t("ETFFlow.bookingdate") }}
              </TableCell>
              <TableCell
                class="font-semibold text-foreground pr-4 py-3 text-base"
              >
                {{ timestampString }}
              </TableCell>
            </TableRow>

            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("ETFFlow.amount") }}
              </TableCell>
              <TableCell class="font-medium pr-4 py-3" :class="amountClass">
                {{ amountString }}
              </TableCell>
            </TableRow>

            <TableRow class="hover:bg-transparent border-b last:border-0">
              <TableCell
                class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
              >
                {{ $t("ETFFlow.price") }}
              </TableCell>
              <TableCell class="font-medium text-foreground pr-4 py-3">
                <SpanAmount :amount="etfFlow.price" />
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
        @click="deleteEtfFlow"
      >
        <Trash2 />
        {{ $t("General.delete") }}
      </Button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import type { EtfFlow } from "@/model/etf/EtfFlow";
import CrudEtfFlowService from "@/service/CrudEtfFlowService";
import { formatDateWithTime } from "@/tools/views/FormatDate";
import { formatNumber, redIfNegative } from "@/tools/views/FormatNumber";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { Trash2 } from "lucide-vue-next";
import { computed, ref, useTemplateRef } from "vue";
import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";
import SpanAmount from "../SpanAmount.vue";

const serverErrors = ref(new Array<string>());

const etfFlow = ref({} as EtfFlow);
const etfName = ref("");
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");
const emit = defineEmits(["etfFlowDeleted"]);

const amountClass = computed(() => {
  return redIfNegative(etfFlow.value.amount);
});
const amountString = computed(() => {
  return formatNumber(etfFlow.value.amount, 6);
});

const timestampString = computed(() => {
  return (
    formatDateWithTime(etfFlow.value.timestamp) +
    ":" +
    String(etfFlow.value.nanoseconds + 1000000000).substring(1, 4) //80000000 -> 1080000000 -> 080
  );
});

const _show = (_etfFlow: EtfFlow, _etfName: string) => {
  etfFlow.value = _etfFlow;
  etfName.value = _etfName;
  serverErrors.value = new Array<string>();
  modalComponent.value?._show();
};
const deleteEtfFlow = () => {
  serverErrors.value = new Array<string>();

  CrudEtfFlowService.deleteEtfFlow(etfFlow.value.etfflowid)
    .then(() => {
      modalComponent.value?._hide();
      emit("etfFlowDeleted", etfFlow.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

defineExpose({ _show });
</script>
