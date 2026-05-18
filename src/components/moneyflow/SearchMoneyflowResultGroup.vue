<template>
  <TableRow>
    <TableCell class="align-middle border-r">
      <Button
        variant="ghost"
        size="icon"
        @click="toggleCollapse"
        :title="isCollapsed ? 'Collapse details' : 'Expand details'"
        :aria-label="isCollapsed ? 'Collapse details' : 'Expand details'"
        class="h-8 w-8 cursor-pointer"
      >
        <ChevronRight v-if="!isCollapsed" class="h-4 w-4" />
        <ChevronDown v-else class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell class="align-middle border-r" v-if="colBookingMonth">
      <router-link
        class="text-primary hover:underline"
        :to="{
          name: Routes.ListReports,
          params: { year: moneyflowGroup.year, month: moneyflowGroup.month },
        }"
      >
        {{ moneyflowGroup.monthString }} {{ moneyflowGroup.year }}
      </router-link>
    </TableCell>
    <TableCell class="align-middle border-r" v-if="colBookingYear">
      <router-link
        class="text-primary hover:underline"
        :to="{
          name: Routes.ListReports,
          params: { year: moneyflowGroup.year },
        }"
      >
        {{ moneyflowGroup.year }}
      </router-link>
    </TableCell>
    <TableCell
      class="align-middle border-r !whitespace-normal"
      v-if="colContractpartner"
    >
      {{ moneyflowGroup.contractpartnerName }}
    </TableCell>

    <TableCell class="text-right border-r align-middle">
      <SpanAmount :amount="moneyflowGroup.amount" />
    </TableCell>
    <TableCell class="text-left align-middle break-words !whitespace-normal">
      {{ moneyflowGroup.commentString }}
    </TableCell>
  </TableRow>

  <TableRow v-if="isCollapsed">
    <TableCell
      :colspan="
        3 +
        (colBookingMonth ? 1 : 0) +
        (colBookingYear ? 1 : 0) +
        (colContractpartner ? 1 : 0)
      "
      class="p-0"
    >
      <div class="p-4">
        <div class="flex flex-col rounded-md border w-full overflow-x-auto">
          <Table class="[&_td]:!py-1 [&_th]:!py-1">
            <TableHeader>
              <TableRow>
                <TableHead class="hidden border-r border-b md:table-cell"
                  ><span class="sr-only">Status</span></TableHead
                >
                <TableHead
                  class="font-bold border-r border-b text-foreground text-center"
                  >{{ $t("Moneyflow.bookingdate") }}</TableHead
                >
                <TableHead
                  class="font-bold border-r border-b text-foreground text-center"
                  >{{ $t("General.amount") }}</TableHead
                >
                <TableHead
                  class="font-bold border-r border-b text-foreground text-center"
                  >{{ $t("General.contractpartner") }}</TableHead
                >
                <TableHead
                  class="font-bold border-r border-b text-foreground text-center"
                  >{{ $t("General.comment") }}</TableHead
                >
                <TableHead
                  class="font-bold border-r border-b text-foreground text-center"
                  >{{ $t("General.postingAccount") }}</TableHead
                >
                <TableHead
                  class="font-bold border-r border-b text-foreground text-center"
                  >{{ $t("General.capitalsource") }}</TableHead
                >
                <TableHead
                  class="font-bold border-b text-foreground text-center"
                  colspan="2"
                ></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <SearchMoneyflowResultRowVue
                v-for="(moneyflow, index) of moneyflowGroup.moneyflows"
                :key="moneyflow.id"
                :mmf="moneyflow"
                :rowspan="rowsPerMoneyflow.get(moneyflow.id) ?? 1"
                :isFirstOfMultipleRowsForSameMoneyflow="
                  firstIndexForMoneyflow.get(moneyflow.id) === index
                "
                :alternateRowBackground="
                  alternateRowBackground.get(moneyflow.id)
                "
                @delete-moneyflow="emitDeleteMoneyflow"
                @edit-moneyflow="emitEditMoneyflow"
                @list-moneyflow="emitListMoneyflow"
                @show-receipt="emitShowReceipt"
              />
            </TableBody>
          </Table>
        </div>
      </div>
    </TableCell>
  </TableRow>
</template>
<script lang="ts" setup>
import { ChevronDown, ChevronRight } from "lucide-vue-next";
import { ref, watch, type PropType } from "vue";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Routes } from "@/router";

import SpanAmount from "../SpanAmount.vue";
import SearchMoneyflowResultRowVue from "./SearchMoneyflowResultRow.vue";

import type { Moneyflow } from "@/model/moneyflow/Moneyflow";

type MoneyflowGroup = {
  month: number;
  monthString: string;
  year: number;
  contractpartnerName: string;
  amount: number;
  comment: Set<string>;
  commentString: string;
  moneyflows: Array<Moneyflow>;
};

const props = defineProps({
  moneyflowGroup: {
    type: Object as PropType<MoneyflowGroup>,
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

const isCollapsed = ref(false);
const emit = defineEmits([
  "showReceipt",
  "deleteMoneyflow",
  "editMoneyflow",
  "listMoneyflow",
]);
const rowsPerMoneyflow = ref(new Map<number, number>());
const firstIndexForMoneyflow = ref(new Map<number, number>());
const alternateRowBackground = ref(new Map<number, boolean>());

watch(
  () => props.moneyflowGroup.moneyflows,
  (moneyflows) => {
    rowsPerMoneyflow.value = new Map();
    firstIndexForMoneyflow.value = new Map();
    alternateRowBackground.value = new Map();
    let i = 0;
    moneyflows.forEach((mmf) => {
      const curVal = rowsPerMoneyflow.value.get(mmf.id);
      if (curVal === undefined) {
        i++;
        alternateRowBackground.value.set(mmf.id, i % 2 === 0);
        rowsPerMoneyflow.value.set(mmf.id, 1);
      } else {
        rowsPerMoneyflow.value.set(mmf.id, curVal + 1);
      }
      if (!firstIndexForMoneyflow.value.has(mmf.id)) {
        firstIndexForMoneyflow.value.set(mmf.id, moneyflows.indexOf(mmf));
      }
    });
  },
  { immediate: true },
);

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};
const emitShowReceipt = (id: number) => {
  emit("showReceipt", id);
};
const emitDeleteMoneyflow = (id: number) => {
  emit("deleteMoneyflow", id);
};
const emitEditMoneyflow = (id: number) => {
  emit("editMoneyflow", id);
};
const emitListMoneyflow = (id: number) => {
  emit("listMoneyflow", id);
};
</script>
