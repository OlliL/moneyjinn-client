<template>
  <div data-testid="predef-moneyflow-desktop-table" class="hidden md:block">
    <DivContentTable>
      <TableHeader>
        <TableRow>
          <TableHead class="font-bold border-r text-foreground text-center">{{
            $t("General.amount")
          }}</TableHead>
          <TableHead class="font-bold border-r text-foreground text-center">{{
            $t("General.contractpartner")
          }}</TableHead>
          <TableHead class="font-bold border-r text-foreground text-center">{{
            $t("General.comment")
          }}</TableHead>
          <TableHead class="font-bold border-r text-foreground text-center">{{
            $t("General.postingAccount")
          }}</TableHead>
          <TableHead class="font-bold border-r text-foreground text-center">{{
            $t("General.capitalsource")
          }}</TableHead>
          <TableHead class="font-bold border-r text-foreground text-center">{{
            $t("PreDefMoneyflow.onceAMonthShort")
          }}</TableHead>
          <TableHead class="font-bold border-r text-foreground text-center">{{
            $t("PreDefMoneyflow.createDate")
          }}</TableHead>
          <TableHead class="font-bold border-r text-foreground text-center">{{
            $t("PreDefMoneyflow.lastUsed")
          }}</TableHead>
          <TableHead colspan="2"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="preDefMoneyflows.length === 0">
          <tr data-testid="predef-moneyflow-empty-desktop">
            <td :colspan="10" class="text-center text-muted-foreground py-8">
              {{ $t("General.noEntries") }}
            </td>
          </tr>
        </template>
        <template v-else>
          <ListPreDefMoneyflowRowVue
            v-for="mpm in preDefMoneyflows"
            :key="mpm.id"
            :mpm="mpm"
            @edit-pre-def-moneyflow="editPreDefMoneyflow"
            @delete-pre-def-moneyflow="deletePreDefMoneyflow"
          />
        </template>
      </TableBody>
    </DivContentTable>
  </div>
</template>

<script lang="ts" setup>
import DivContentTable from "@/components/DivContentTable.vue";
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import type { PropType } from "vue";
import ListPreDefMoneyflowRowVue from "./ListPreDefMoneyflowRow.vue";

defineProps({
  preDefMoneyflows: {
    type: Array as PropType<PreDefMoneyflow[]>,
    required: true,
  },
});

const emit = defineEmits(["editPreDefMoneyflow", "deletePreDefMoneyflow"]);

const editPreDefMoneyflow = (mpm: PreDefMoneyflow) => {
  emit("editPreDefMoneyflow", mpm);
};

const deletePreDefMoneyflow = (mpm: PreDefMoneyflow) => {
  emit("deletePreDefMoneyflow", mpm);
};
</script>
