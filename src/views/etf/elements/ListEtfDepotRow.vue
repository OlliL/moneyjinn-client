<template>
  <TableRow :data-testid="`etf-depot-row-${flow.etfflowid}`">
    <TableCell class="text-left">
      {{ timestampString }}
    </TableCell>
    <TableCell class="text-right">
      <span :class="amountClass">{{ amountString }}</span>
    </TableCell>
    <TableCell class="text-right">
      <SpanAmount :amount="flow.price" :decimal-places="3" />
    </TableCell>
    <TableCell class="text-right"
      ><SpanAmount :amount="flow.amount * flow.price"
    /></TableCell>
    <TableCell class="text-right" v-if="showLumpSum">
      <HoverCard :open-delay="100" :close-delay="100">
        <HoverCardTrigger class="text-right group relative cursor-pointer">
          <SpanAmount
            :amount="flow.accumulatedPreliminaryLumpSum * (partial / 100)"
            :decimal-places="3"
          />
        </HoverCardTrigger>

        <HoverCardContent
          side="top"
          align="end"
          class="w-auto p-3 bg-background border rounded-sm shadow-lg z-50"
        >
          <Table class="border">
            <TableHeader>
              <TableRow>
                <TableHead class="table-head-cell">
                  <span class="sr-only">Year</span>
                </TableHead>
                <TableHead class="table-head-cell">100%</TableHead>
                <TableHead class="table-head-cell" v-if="partial < 100">
                  {{ formatNumber(partial, 0) }}%
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="entry of flow.preliminaryLumpSumPerYear.entries()"
                :key="entry[0]"
              >
                <TableCell class="font-bold">{{ entry[0] }}</TableCell>
                <TableCell class="text-right">
                  <SpanAmount :amount="entry[1]" :decimal-places="3" />
                </TableCell>
                <TableCell class="text-right" v-if="partial < 100">
                  <SpanAmount
                    :amount="entry[1] * (partial / 100)"
                    :decimal-places="3"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell class="font-bold text-right">&sum;</TableCell>
                <TableCell class="text-right">
                  <u
                    ><SpanAmount
                      :amount="flow.accumulatedPreliminaryLumpSum"
                      :decimal-places="3"
                  /></u>
                </TableCell>
                <TableCell class="text-right" v-if="partial < 100">
                  <u
                    ><SpanAmount
                      :amount="
                        flow.accumulatedPreliminaryLumpSum * (partial / 100)
                      "
                      :decimal-places="3"
                  /></u>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </HoverCardContent>
      </HoverCard>
    </TableCell>
    <ButtonTableIcon
      :title="$t('General.edit')"
      :aria-label="$t('General.edit')"
      :test-id="`etf-depot-edit-${flow.etfflowid}`"
      button-class="h-6 w-6 cursor-pointer"
      @click="actions.edit(flow)"
    >
      <Pencil class="icon-medium" />
    </ButtonTableIcon>
    <ButtonTableIcon
      :title="$t('General.delete')"
      :aria-label="$t('General.delete')"
      :test-id="`etf-depot-delete-${flow.etfflowid}`"
      button-class="h-6 w-6 cursor-pointer"
      @click="actions.delete(flow)"
    >
      <Trash2 class="icon-medium" />
    </ButtonTableIcon>
  </TableRow>
</template>
<script lang="ts" setup>
import ButtonTableIcon from "@/components/common/ButtonTableIcon.vue";
import SpanAmount from "@/components/common/SpanAmount.vue";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EtfFlowActionsKey } from "@/model/CrudActions";
import type { EtfFlow } from "@/model/etf/EtfFlow";
import { useEtfStore } from "@/stores/EtfStore";
import { formatDateWithTime } from "@/tools/views/FormatDate";
import { formatNumber, redIfNegative } from "@/tools/views/FormatNumber";
import { Pencil, Trash2 } from "lucide-vue-next";
import { computed, inject } from "vue";

const props = defineProps<{
  flow: EtfFlow;
  showLumpSum: boolean;
}>();

const etfStore = useEtfStore();
const partial = computed(
  () => 100 - (etfStore.getEtf(props.flow.etfId)?.partialTaxExemption ?? 0),
);

const amountClass = computed(() => redIfNegative(props.flow.amount));
const amountString = computed(() => formatNumber(props.flow.amount, 6));
const timestampString = computed(
  () =>
    formatDateWithTime(props.flow.timestamp) +
    ":" +
    String(props.flow.nanoseconds + 1000000000).substring(1, 4), //80000000 -> 1080000000 -> 080
);

const actions = inject(EtfFlowActionsKey)!;
</script>
