<template>
  <TableRow>
    <TableCell class="text-left border">
      <SpanIban :iban="mca.accountNumber" />
    </TableCell>
    <TableCell class="text-left border">
      {{ mca.bankCode }}
    </TableCell>
    <TableActionButton
      :title="$t('General.edit')"
      cell-class="text-right border"
      @click="editContractpartnerAccount"
    >
        <Pencil class="h-4 w-4" />
    </TableActionButton>
    <TableActionButton
      :title="$t('General.delete')"
      cell-class="text-right border"
      @click="deleteContractpartnerAccount"
    >
        <Trash2 class="h-4 w-4" />
    </TableActionButton>
  </TableRow>
</template>

<script lang="ts" setup>
import { Pencil, Trash2 } from "lucide-vue-next";
import type { PropType } from "vue";

import { TableCell, TableRow } from "@/components/ui/table";

import type { ContractpartnerAccount } from "@/model/contractpartneraccount/ContractpartnerAccount";
import SpanIban from "../SpanIban.vue";
import TableActionButton from "../TableActionButton.vue";

const props = defineProps({
  mca: {
    type: Object as PropType<ContractpartnerAccount>,
    required: true,
  },
});

const emit = defineEmits([
  "deleteContractpartnerAccount",
  "editContractpartnerAccount",
]);

const deleteContractpartnerAccount = () => {
  emit("deleteContractpartnerAccount", props.mca);
};

const editContractpartnerAccount = () => {
  emit("editContractpartnerAccount", props.mca);
};
</script>
