<template>
  <div
    data-testid="contractpartner-matching-desktop-table"
    class="hidden md:block"
  >
    <DivContentTable class="max-w-5xl">
      <TableHeader>
        <TableRow>
          <TableHead class="table-head-cell">{{
            $t("ContractpartnerMatching.matchingText")
          }}</TableHead>
          <TableHead class="table-head-cell">{{
            $t("General.contractpartner")
          }}</TableHead>
          <TableHead class="table-head-cell">{{
            $t("Contractpartner.moneyflowComment")
          }}</TableHead>
          <TableHead class="table-head-cell">{{
            $t("General.postingAccount")
          }}</TableHead>
          <TableHead class="table-head-cell">{{
            $t("General.lastUsed")
          }}</TableHead>
          <TableHead colspan="2"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <ListContractpartnerMatchingRowVue
          v-for="mcm in contractpartnerMatchings"
          :key="mcm.id"
          :mcm="mcm"
          @edit-contractpartner-matching="editContractpartnerMatching"
          @delete-contractpartner-matching="deleteContractpartnerMatching"
        />
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
import type { ContractpartnerMatching } from "@/model/contractpartnermatching/ContractpartnerMatching";
import ListContractpartnerMatchingRowVue from "./ListContractpartnerMatchingRow.vue";

defineProps<{
  contractpartnerMatchings: ContractpartnerMatching[];
}>();

const emit = defineEmits<{
  editContractpartnerMatching: [
    contractpartnerMatching: ContractpartnerMatching,
  ];
  deleteContractpartnerMatching: [
    contractpartnerMatching: ContractpartnerMatching,
  ];
}>();

const editContractpartnerMatching = (mcm: ContractpartnerMatching) => {
  emit("editContractpartnerMatching", mcm);
};

const deleteContractpartnerMatching = (mcm: ContractpartnerMatching) => {
  emit("deleteContractpartnerMatching", mcm);
};
</script>
