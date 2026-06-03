<template>
  <AccordionItem :value="groupKey" class="border rounded-xl bg-muted/20 px-1">
    <AccordionTrigger class="hover:no-underline py-3 px-3">
      <div
        class="grid grid-cols-[1fr_auto] items-center w-full text-left pr-4 gap-2"
      >
        <div class="flex flex-col gap-0.5 overflow-hidden min-w-0">
          <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
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
        <div
          class="font-extrabold text-base whitespace-nowrap shrink-0 text-right"
        >
          <SpanAmount :amount="moneyflowGroup.amount" />
        </div>
      </div>
    </AccordionTrigger>
    <AccordionContent class="px-2 pb-3 pt-1">
      <Accordion type="multiple" class="space-y-2">
        <DisplayMoneyflowRowMobile
          v-for="moneyflow in moneyflowGroup.moneyflows"
          :key="moneyflow.id"
          :mmf="moneyflow"
          :hide-contractpartner="hideContractpartner || colContractpartner"
          :show-comment-in-trigger="true"
          @delete-moneyflow="$emit('deleteMoneyflow', $event)"
          @edit-moneyflow="$emit('editMoneyflow', $event)"
          @list-moneyflow="$emit('listMoneyflow', $event)"
          @show-receipt="$emit('showReceipt', $event)"
        />
      </Accordion>
    </AccordionContent>
  </AccordionItem>
</template>

<script lang="ts" setup>
import SpanAmount from "@/components/common/SpanAmount.vue";
import DisplayMoneyflowRowMobile from "@/components/moneyflow/DisplayMoneyflowRowMobile.vue";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { MoneyflowGroup } from "../SearchMoneyflows.vue";

withDefaults(
  defineProps<{
    moneyflowGroup: MoneyflowGroup;
    groupKey: string;
    colBookingMonth: boolean;
    colBookingYear: boolean;
    colContractpartner: boolean;
    hideContractpartner?: boolean;
  }>(),
  {
    hideContractpartner: false,
  },
);

defineEmits([
  "showReceipt",
  "deleteMoneyflow",
  "editMoneyflow",
  "listMoneyflow",
]);
</script>
