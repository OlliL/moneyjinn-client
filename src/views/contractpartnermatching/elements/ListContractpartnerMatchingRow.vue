<template>
  <TableRow :data-testid="`contractpartner-matching-row-${mcm.id}`">
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
    <TableCell class="text-center border-r py-1 px-2">
      <SpanDate :date="mcm.lastUsed" />
    </TableCell>
    <ButtonTableIcon
      :title="$t('General.edit')"
      :test-id="`contractpartner-matching-edit-${mcm.id}`"
      @click="editContractpartnerMatching"
    >
      <Pencil class="icon-medium" />
    </ButtonTableIcon>
    <ButtonTableIcon
      :title="$t('General.delete')"
      :test-id="`contractpartner-matching-delete-${mcm.id}`"
      @click="deleteContractpartnerMatching"
    >
      <Trash2 class="icon-medium" />
    </ButtonTableIcon>
  </TableRow>
</template>

<script lang="ts" setup>
import ButtonTableIcon from "@/components/common/ButtonTableIcon.vue";
import SpanDate from "@/components/common/SpanDate.vue";
import { TableCell, TableRow } from "@/components/ui/table";
import type { ContractpartnerMatching } from "@/model/contractpartnermatching/ContractpartnerMatching";
import { Pencil, Trash2 } from "lucide-vue-next";
import type { PropType } from "vue";

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
