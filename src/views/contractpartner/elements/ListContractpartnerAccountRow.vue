<template>
  <TableRow>
    <TableCell class="text-left border">
      <SpanIban :iban="mca.accountNumber" />
    </TableCell>
    <TableCell class="text-left border">
      {{ mca.bankCode }}
    </TableCell>
    <ButtonTableIcon
      :title="$t('General.edit')"
      @click="editContractpartnerAccount"
    >
      <Pencil class="h-4 w-4" />
    </ButtonTableIcon>
    <ButtonTableIcon
      :title="$t('General.delete')"
      @click="deleteContractpartnerAccount"
    >
      <Trash2 class="h-4 w-4" />
    </ButtonTableIcon>
  </TableRow>
</template>

<script lang="ts" setup>
import { Pencil, Trash2 } from "lucide-vue-next";
import type { PropType } from "vue";

import { TableCell, TableRow } from "@/components/ui/table";

import type { ContractpartnerAccount } from "@/model/contractpartneraccount/ContractpartnerAccount";
import ButtonTableIcon from "@/components/ButtonTableIcon.vue";
import SpanIban from "@/components/SpanIban.vue";

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
