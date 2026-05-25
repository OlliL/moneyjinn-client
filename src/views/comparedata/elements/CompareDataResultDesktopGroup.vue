<template>
  <TableRow>
    <TableCell class="align-middle">
      <Button
        v-if="compareDatasCount > 0"
        variant="ghost"
        size="icon"
        :data-testid="`${groupTestId}-toggle`"
        @click="toggleCollapse"
        :title="isCollapsed ? 'Collapse details' : 'Expand details'"
        :aria-label="isCollapsed ? 'Collapse details' : 'Expand details'"
        class="action-icon-button"
      >
        <ChevronRight v-if="!isCollapsed" class="icon-medium" />
        <ChevronDown v-else class="icon-medium" />
      </Button>
    </TableCell>
    <TableCell class="align-middle font-bold" :class="amountClass">
      {{ compareDatasCount }}
    </TableCell>
    <TableCell class="text-left align-middle">
      {{ comment }}
    </TableCell>
  </TableRow>
  <TableRow v-if="compareData && isCollapsed" class="hover:bg-transparent!">
    <TableCell colspan="3" class="p-0">
      <div class="p-4">
        <div class="flex flex-col rounded-md border w-full overflow-hidden">
          <Table class="w-full [&_td]:py-0.5! [&_th]:py-1!">
            <TableHeader>
              <TableRow>
                <TableHead class="table-head-cell w-[120px]">
                  <span class="sr-only">Status</span>
                </TableHead>

                <TableHead class="table-head-cell w-[140px]">
                  {{ $t("Moneyflow.bookingdate") }}
                </TableHead>
                <TableHead class="table-head-cell w-[140px]">
                  {{ $t("Moneyflow.invoicedate") }}
                </TableHead>

                <TableHead class="table-head-cell w-25">
                  {{ $t("General.amount") }}
                </TableHead>

                <TableHead class="table-head-cell w-[20%]">
                  {{ $t("General.contractpartner") }}
                </TableHead>
                <TableHead class="table-head-cell w-[30%]">
                  {{ $t("General.comment") }}
                </TableHead>

                <TableHead class="table-head-cell w-45">
                  {{ $t("General.capitalsource") }}
                </TableHead>

                <TableHead class="table-head-cell w-11.25">
                  <span class="sr-only">Edit</span>
                </TableHead>
                <TableHead class="table-head-cell w-11.25">
                  <span class="sr-only">Delete</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <CompareDataResultDesktopRowVue
                v-for="(data, idx) in compareData"
                :key="idx"
                :row-index="idx"
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
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CompareData } from "@/model/comparedata/CompareData";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { ChevronDown, ChevronRight } from "lucide-vue-next";
import { computed, ref, type PropType } from "vue";
import CompareDataResultDesktopRowVue from "./CompareDataResultDesktopRow.vue";

const props = defineProps({
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
  groupTestId: {
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
