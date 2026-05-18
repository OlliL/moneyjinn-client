<template>
  <TableRow>
    <TableCell class="text-left border-r py-1 px-2">
      {{ mcm.matchingText }}
    </TableCell>
    <TableCell class="text-left border-r py-1 px-2">
      {{ mcm.contractpartnerName }}
    </TableCell>
    <TableCell class="text-left border-r py-1 px-2">
      {{ mcm.moneyflowComment }}
    </TableCell>
    <TableCell class="text-left border-r py-1 px-2">
      {{ mcm.postingAccountName }}
    </TableCell>
    <TableActionButton
      :title="$t('General.edit')"
      @click="editContractpartnerMatching"
    >
        <Pencil class="h-4 w-4" />
    </TableActionButton>
    <TableActionButton
      :title="$t('General.delete')"
      cell-class="w-0 border-l whitespace-nowrap text-center p-0"
      @click="deleteContractpartnerMatching"
    >
        <Trash2 class="h-4 w-4" />
    </TableActionButton>
  </TableRow>
</template>

<script lang="ts" setup>
import { TableCell, TableRow } from "@/components/ui/table";
import type { ContractpartnerMatching } from "@/model/contractpartnermatching/ContractpartnerMatching";
import { Pencil, Trash2 } from "lucide-vue-next";
import type { PropType } from "vue";
import TableActionButton from "../TableActionButton.vue";

const props = defineProps({
  mcm: {
    type: Object as PropType<ContractpartnerMatching>,
    required: true,
  },
});

const emit = defineEmits([
  "deleteContractpartnerMatching",
  "editContractpartnerMatching",
]);

const deleteContractpartnerMatching = () => {
  emit("deleteContractpartnerMatching", props.mcm);
};
const editContractpartnerMatching = () => {
  emit("editContractpartnerMatching", props.mcm);
};
</script>
