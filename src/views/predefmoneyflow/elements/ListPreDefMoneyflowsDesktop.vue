<template>
  <div data-testid="predef-moneyflow-desktop-table" class="hidden md:block">
    <DivContentTable>
      <TableHeader>
        <TableRow>
          <TableHead class="table-head-cell"></TableHead>
          <TableHead class="table-head-cell">{{
            $t("General.amount")
          }}</TableHead>
          <TableHead class="table-head-cell">{{
            $t("General.contractpartner")
          }}</TableHead>
          <TableHead class="table-head-cell">{{
            $t("General.comment")
          }}</TableHead>
          <TableHead class="table-head-cell">{{
            $t("General.postingAccount")
          }}</TableHead>
          <TableHead class="table-head-cell">{{
            $t("General.capitalsource")
          }}</TableHead>
          <TableHead class="table-head-cell">{{
            $t("PreDefMoneyflow.onceAMonthShort")
          }}</TableHead>
          <TableHead class="table-head-cell">{{
            $t("PreDefMoneyflow.createDate")
          }}</TableHead>
          <TableHead class="table-head-cell">{{
            $t("PreDefMoneyflow.lastUsed")
          }}</TableHead>
          <TableHead colspan="2"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="preDefMoneyflows.length === 0">
          <tr data-testid="predef-moneyflow-empty-desktop">
            <td :colspan="11" class="text-center text-muted-foreground py-8">
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
import DivContentTable from "@/components/common/DivContentTable.vue";
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import ListPreDefMoneyflowRowVue from "./ListPreDefMoneyflowRow.vue";

defineProps<{
  preDefMoneyflows: PreDefMoneyflow[];
}>();

const emit = defineEmits<{
  deletePreDefMoneyflow: [preDefMoneyflow: PreDefMoneyflow];
  editPreDefMoneyflow: [preDefMoneyflow: PreDefMoneyflow];
}>();

const editPreDefMoneyflow = (mpm: PreDefMoneyflow) => {
  emit("editPreDefMoneyflow", mpm);
};

const deletePreDefMoneyflow = (mpm: PreDefMoneyflow) => {
  emit("deletePreDefMoneyflow", mpm);
};
</script>
