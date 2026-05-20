<template>
  <div data-testid="contractpartner-matching-desktop-table" class="hidden md:block">
    <DivContentTable class="max-w-5xl">
      <TableHeader>
        <TableRow>
          <TableHead class="font-bold border-r text-foreground text-center">{{
            $t("ContractpartnerMatching.matchingText")
          }}</TableHead>
          <TableHead class="font-bold border-r text-foreground text-center">{{
            $t("General.contractpartner")
          }}</TableHead>
          <TableHead class="font-bold border-r text-foreground text-center">{{
            $t("Contractpartner.moneyflowComment")
          }}</TableHead>
          <TableHead class="font-bold border-r text-foreground text-center">{{
            $t("General.postingAccount")
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
import DivContentTable from "@/components/DivContentTable.vue";
import ListContractpartnerMatchingRowVue from "./ListContractpartnerMatchingRow.vue";
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ContractpartnerMatching } from "@/model/contractpartnermatching/ContractpartnerMatching";
import type { PropType } from "vue";

defineProps({
  contractpartnerMatchings: {
    type: Array as PropType<ContractpartnerMatching[]>,
    required: true,
  },
});

const emit = defineEmits([
  "editContractpartnerMatching",
  "deleteContractpartnerMatching",
]);

const editContractpartnerMatching = (mcm: ContractpartnerMatching) => {
  emit("editContractpartnerMatching", mcm);
};

const deleteContractpartnerMatching = (mcm: ContractpartnerMatching) => {
  emit("deleteContractpartnerMatching", mcm);
};
</script>

