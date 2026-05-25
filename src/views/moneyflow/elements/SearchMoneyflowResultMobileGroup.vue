<template>
  <AccordionItem :value="groupKey" class="border rounded-xl bg-muted/20 px-1">
    <AccordionTrigger class="hover:no-underline py-3 px-3">
      <div class="flex items-center justify-between w-full text-left pr-4">
        <div class="flex flex-col gap-0.5 overflow-hidden mr-2">
          <div class="flex items-center gap-2 text-xs text-muted-foreground">
            <span v-if="colBookingMonth">
              {{ moneyflowGroup.monthString }} {{ moneyflowGroup.year }}
            </span>
            <span v-else-if="colBookingYear">
              {{ moneyflowGroup.year }}
            </span>
          </div>
          <div
            v-if="colContractpartner"
            class="font-bold text-sm text-foreground truncate"
          >
            {{ moneyflowGroup.contractpartnerName }}
          </div>
        </div>
        <div class="font-extrabold text-base whitespace-nowrap">
          <SpanAmount :amount="moneyflowGroup.amount" />
        </div>
      </div>
    </AccordionTrigger>
    <AccordionContent class="px-2 pb-3 pt-1">
      <Accordion type="multiple" class="space-y-2">
        <ReportTableMobileRow
          v-for="moneyflow in moneyflowGroup.moneyflows"
          :key="moneyflow.id"
          :mmf="moneyflow"
          @delete-moneyflow="emitDeleteMoneyflow"
          @edit-moneyflow="emitEditMoneyflow"
          @list-moneyflow="emitListMoneyflow"
          @show-receipt="emitShowReceipt"
        />
      </Accordion>
    </AccordionContent>
  </AccordionItem>
</template>

<script lang="ts" setup>
import SpanAmount from "@/components/common/SpanAmount.vue";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import ReportTableMobileRow from "@/views/reports/elements/ReportTableMobileRow.vue";
import type { PropType } from "vue";

defineProps({
  moneyflowGroup: {
    type: Object as PropType<any>,
    required: true,
  },
  groupKey: {
    type: String,
    required: true,
  },
  colBookingMonth: {
    type: Boolean,
    required: true,
  },
  colBookingYear: {
    type: Boolean,
    required: true,
  },
  colContractpartner: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits([
  "showReceipt",
  "deleteMoneyflow",
  "editMoneyflow",
  "listMoneyflow",
]);

const emitShowReceipt = (id: number) => emit("showReceipt", id);
const emitDeleteMoneyflow = (mmf: Moneyflow) => emit("deleteMoneyflow", mmf);
const emitEditMoneyflow = (mmf: Moneyflow) => emit("editMoneyflow", mmf);
const emitListMoneyflow = (mmf: Moneyflow) => emit("listMoneyflow", mmf);
</script>
