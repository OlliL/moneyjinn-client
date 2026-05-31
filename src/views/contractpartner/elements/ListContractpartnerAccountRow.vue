<template>
  <TableRow>
    <TableCell class="text-left border">
      <SpanIban :iban="mca.accountNumber" />
    </TableCell>
    <TableCell class="text-left border">
      {{ mca.bankCode }}
    </TableCell>
    <TableCell class="text-center border-r py-1 px-2">
      <SpanDate :date="mca.lastUsed" />
    </TableCell>
    <ButtonTableIcon
      :title="$t('General.edit')"
      @click="editContractpartnerAccount"
    >
      <Pencil class="icon-medium" />
    </ButtonTableIcon>
    <ButtonTableIcon
      :title="$t('General.delete')"
      @click="deleteContractpartnerAccount"
    >
      <Trash2 class="icon-medium" />
    </ButtonTableIcon>
  </TableRow>
</template>

<script lang="ts" setup>
import { Pencil, Trash2 } from "lucide-vue-next";
import type { PropType } from "vue";

import { TableCell, TableRow } from "@/components/ui/table";

import ButtonTableIcon from "@/components/common/ButtonTableIcon.vue";
import SpanDate from "@/components/common/SpanDate.vue";
import SpanIban from "@/components/common/SpanIban.vue";
import type { ContractpartnerAccount } from "@/model/contractpartneraccount/ContractpartnerAccount";

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
