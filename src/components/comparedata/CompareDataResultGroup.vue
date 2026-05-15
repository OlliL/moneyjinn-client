<template>
  <TableRow>
    <TableCell class="align-middle">
      <Button
        v-if="compareDatasCount > 0"
        variant="ghost"
        size="icon"
        @click="toggleCollapse"
        :title="isCollapsed ? 'Collapse details' : 'Expand details'"
        :aria-label="isCollapsed ? 'Collapse details' : 'Expand details'"
        class="h-8 w-8"
      >
        <ChevronRight v-if="!isCollapsed" class="h-4 w-4" />
        <ChevronDown v-else class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell class="align-middle font-bold" :class="amountClass">
      {{ compareDatasCount }}
    </TableCell>
    <TableCell class="text-left align-middle">
      {{ comment }}
    </TableCell>
  </TableRow>
  <TableRow v-if="compareData && isCollapsed">
    <TableCell colspan="5" class="p-0">
      <div class="p-4">
        <div class="flex flex-col rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="font-bold border text-foreground text-center"
                  ><span class="sr-only">Status</span></TableHead
                >
                <TableHead
                  class="font-bold border text-foreground text-center"
                  >{{ $t("Moneyflow.bookingdate") }}</TableHead
                >
                <TableHead
                  class="font-bold border text-foreground text-center"
                  >{{ $t("Moneyflow.invoicedate") }}</TableHead
                >
                <TableHead
                  class="font-bold border text-foreground text-center"
                  >{{ $t("General.amount") }}</TableHead
                >
                <TableHead
                  class="font-bold border text-foreground text-center"
                  >{{ $t("General.contractpartner") }}</TableHead
                >
                <TableHead
                  class="font-bold border text-foreground text-center"
                  >{{ $t("General.comment") }}</TableHead
                >
                <TableHead
                  class="font-bold border text-foreground text-center"
                  >{{ $t("General.capitalsource") }}</TableHead
                >
                <TableHead
                  class="font-bold border text-foreground text-center"
                  colspan="2"
                  ><span class="sr-only">Actions</span></TableHead
                >
              </TableRow>
            </TableHeader>
            <TableBody>
              <CompareDataResultRowVue
                v-for="(data, idx) in compareData"
                :key="idx"
                :mmf="data.moneyflow"
                :import-data="data.compareDataDataset"
                :capitalsource-id="capitalsourceId"
                :capitalsource-comment="capitalsourceComment"
                @delete-moneyflow="emitDeleteMoneyflow"
                @edit-moneyflow="emitEditMoneyflow"
                @create-moneyflow="emitCreateMoneyflow"
              />
            </TableBody>
          </Table>
        </div>
      </div>
    </TableCell>
  </TableRow>
</template>
<script lang="ts" setup>
import { computed, ref, type PropType } from "vue";
import { ChevronRight, ChevronDown } from "lucide-vue-next";

import {
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
  TableBody,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import CompareDataResultRowVue from "./CompareDataResultRow.vue";

import type { CompareData } from "@/model/comparedata/CompareData";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";

const props = defineProps({
  compareDataKey: {
    type: String,
    required: true,
  },
  compareData: {
    type: Object as PropType<Array<CompareData>>,
    required: false,
  },
  comment: {
    type: String,
    required: true,
  },
  amountClass: {
    type: String,
    required: true,
  },
  capitalsourceId: {
    type: Number,
    required: true,
  },
  capitalsourceComment: {
    type: String,
    required: true,
  },
});

const isCollapsed = ref(false);
const emit = defineEmits([
  "deleteMoneyflow",
  "editMoneyflow",
  "createMoneyflow",
]);

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};
const emitDeleteMoneyflow = (id: number) => {
  emit("deleteMoneyflow", id);
};
const emitEditMoneyflow = (id: number) => {
  emit("editMoneyflow", id);
};
const emitCreateMoneyflow = (moneyflow: Moneyflow) => {
  emit("createMoneyflow", moneyflow);
};
const compareDatasCount = computed(() => {
  return props.compareData ? props.compareData.length : 0;
});
</script>
