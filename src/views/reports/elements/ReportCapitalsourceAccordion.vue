<template>
  <AccordionItem
    :value="titleKey"
    class="border rounded-lg bg-card shadow-sm overflow-hidden"
  >
    <AccordionTrigger class="hover:no-underline w-full min-w-0 py-2.5 px-3">
      <div class="flex justify-between items-center w-full gap-2">
        <h4 class="text-sm font-bold text-foreground">
          {{ $t(titleKey) }}
        </h4>
        <div
          v-if="cashSum !== 0"
          class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium border border-border/50 shadow-xs"
        >
          <Coins class="icon-extra-small shrink-0" />
          <SpanAmount :amount="cashSum" />
        </div>
        <span class="font-extrabold text-sm">
          <SpanAmount :amount="displaySum" />
        </span>
      </div>
    </AccordionTrigger>

    <AccordionContent class="p-0">
      <div class="px-3 pb-3 pt-1 border-t bg-muted/5">
        <CapitalsourceTable
          :capitalsource-data="capitalsourceData"
          :current-month-is-settled="currentMonthIsSettled"
        />
      </div>
    </AccordionContent>
  </AccordionItem>
</template>

<script lang="ts" setup>
import SpanAmount from "@/components/common/SpanAmount.vue";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CapitalsourceState } from "@/model/capitalsource/CapitalsourceState";
import type { ReportTurnoverCapitalsource } from "@/model/report/ReportTurnoverCapitalsource";
import { useCapitalsourceStore } from "@/stores/CapitalsourceStore";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import { Coins } from "lucide-vue-next";
import { computed, type PropType } from "vue";
import CapitalsourceTable from "./CapitalsourceTable.vue";
import { useCapitalsourceSums } from "./useCapitalsourceSums";

const props = defineProps({
  titleKey: {
    type: String,
    required: true,
  },
  capitalsourceData: {
    type: Array as PropType<ReportTurnoverCapitalsource[]>,
    required: true,
  },
  currentMonthIsSettled: {
    type: Boolean,
    required: true,
  },
});

const { capitalsource } = useCapitalsourceStore();
const { getUserId } = useUserSessionStore();
const { amountEndOfMonthFixedSum, amountCurrentSum } = useCapitalsourceSums(
  computed(() => props.capitalsourceData),
);

const displaySum = computed(() => {
  return props.currentMonthIsSettled
    ? amountEndOfMonthFixedSum.value
    : amountCurrentSum.value;
});

const cashSum = computed(() => {
  const cashCapitalsource = capitalsource
    .filter((item) => item.state === CapitalsourceState.CASH)
    .find((item) => item.userId === getUserId);

  return props.capitalsourceData
    .filter((item) => item.capitalsourceComment === cashCapitalsource?.comment)
    .reduce((acc, item) => {
      const val = props.currentMonthIsSettled
        ? (item.amountEndOfMonthFixed ?? 0)
        : (item.amountCurrent ?? 0);
      return acc + val;
    }, 0);
});
</script>
