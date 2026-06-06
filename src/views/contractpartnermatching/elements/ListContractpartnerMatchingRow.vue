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
      @click="actions.edit(mcm)"
    >
      <Pencil class="icon-medium" />
    </ButtonTableIcon>
    <ButtonTableIcon
      :title="$t('General.delete')"
      :test-id="`contractpartner-matching-delete-${mcm.id}`"
      @click="actions.delete(mcm)"
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
import { ContractpartnerMatchingActionsKey } from "@/model/CrudActions";
import { Pencil, Trash2 } from "lucide-vue-next";
import { inject } from "vue";

defineProps<{
  mcm: ContractpartnerMatching;
}>();
const actions = inject(ContractpartnerMatchingActionsKey)!;
</script>
