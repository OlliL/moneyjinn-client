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
      <div class="px-3 pb-3 pt-1 border-t bg-muted/5 space-y-4">
        <Accordion
          type="single"
          collapsible
          class="w-full rounded-md bg-background space-y-2"
        >
          <CapitalsourceTableMobileRow
            v-for="data in capitalsourceData"
            :key="data.capitalsourceComment"
            v-bind="{
              ...data,
              currentMonthIsSettled: currentMonthIsSettled,
            }"
          />
        </Accordion>

        <div class="border rounded-md p-4 bg-muted/30 space-y-2 text-sm">
          <div
            class="font-bold border-b pb-1 text-xs uppercase tracking-wider text-muted-foreground"
          >
            {{ $t("Reports.overallSums") }}
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <span class="text-xs-muted block">{{
                $t("Reports.beginOfMonth")
              }}</span>
              <span class="font-semibold"
                ><SpanAmount :amount="amountBeginOfMonthFixedSum"
              /></span>
            </div>

            <div v-if="currentMonthIsSettled">
              <span class="text-xs-muted block">{{
                $t("Reports.endOfMonthFixed")
              }}</span>
              <span class="font-semibold"
                ><SpanAmount :amount="amountEndOfMonthFixedSum"
              /></span>
            </div>

            <div>
              <span class="text-xs-muted block">{{
                $t("Reports.endOfMonthCalculated")
              }}</span>
              <span class="font-semibold"
                ><SpanAmount :amount="amountEndOfMonthCalculatedSum"
              /></span>
            </div>

            <div v-if="currentMonthIsSettled">
              <span class="text-xs-muted block">{{
                $t("Reports.difference")
              }}</span>
              <span class="font-semibold"
                ><SpanAmount :amount="differenceFixedCalculatedSum"
              /></span>
            </div>

            <div v-if="!currentMonthIsSettled">
              <span class="text-xs-muted block">{{
                $t("Reports.currentAmount")
              }}</span>
              <span class="font-semibold"
                ><SpanAmount :amount="amountCurrentSum"
              /></span>
            </div>
          </div>
        </div>
      </div>
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
import { CapitalsourceState } from "@/model/capitalsource/CapitalsourceState";
import type { ReportTurnoverCapitalsource } from "@/model/report/ReportTurnoverCapitalsource";
import { useCapitalsourceStore } from "@/stores/CapitalsourceStore";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import { Coins } from "lucide-vue-next";
import { computed } from "vue";
import CapitalsourceTableMobileRow from "./CapitalsourceTableMobileRow.vue";
import { useCapitalsourceSums } from "./useCapitalsourceSums";

const props = defineProps<{
  titleKey: string;
  capitalsourceData: Array<ReportTurnoverCapitalsource>;
  currentMonthIsSettled: boolean;
}>();

const { capitalsource } = useCapitalsourceStore();
const { getUserId } = useUserSessionStore();
const {
  amountBeginOfMonthFixedSum,
  amountEndOfMonthCalculatedSum,
  amountEndOfMonthFixedSum,
  amountCurrentSum,
  differenceFixedCalculatedSum,
} = useCapitalsourceSums(computed(() => props.capitalsourceData));

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
