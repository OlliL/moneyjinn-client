<template>
  <TableRow :data-testid="`group-row-${group.id}`">
    <TableCell class="text-left border-r">{{ group.name }}</TableCell>
    <ButtonTableIcon
      :title="$t('General.edit')"
      :test-id="`group-edit-${group.id}`"
      @click="actions.edit(group)"
    >
      <Pencil class="icon-medium" />
    </ButtonTableIcon>
    <ButtonTableIcon
      :title="$t('General.delete')"
      :test-id="`group-delete-${group.id}`"
      @click="actions.delete(group)"
    >
      <Trash2 class="icon-medium" />
    </ButtonTableIcon>
  </TableRow>
</template>
<script lang="ts" setup>
import ButtonTableIcon from "@/components/common/ButtonTableIcon.vue";
import { TableCell, TableRow } from "@/components/ui/table";
import { GroupActionsKey } from "@/model/CrudActions";
import type { Group } from "@/model/group/Group";
import { Pencil, Trash2 } from "@lucide/vue";
import { inject } from "vue";

defineProps<{
  group: Group;
}>();
const actions = inject(GroupActionsKey)!;
</script>
