<template>
  <TableRow :data-testid="`group-row-${group.id}`">
    <TableCell class="text-left border-r">{{ group.name }}</TableCell>
    <ButtonTableIcon
      :title="$t('General.edit')"
      :test-id="`group-edit-${group.id}`"
      @click="editGroup"
    >
      <Pencil class="icon-medium" />
    </ButtonTableIcon>
    <ButtonTableIcon
      :title="$t('General.delete')"
      :test-id="`group-delete-${group.id}`"
      @click="deleteGroup"
    >
      <Trash2 class="icon-medium" />
    </ButtonTableIcon>
  </TableRow>
</template>
<script lang="ts" setup>
import ButtonTableIcon from "@/components/common/ButtonTableIcon.vue";
import { TableCell, TableRow } from "@/components/ui/table";
import type { Group } from "@/model/group/Group";
import { Pencil, Trash2 } from "lucide-vue-next";
import type { PropType } from "vue";

const props = defineProps<{
    group: Group;
}>();

const emit = defineEmits(["deleteGroup", "editGroup"]);

const deleteGroup = () => {
  emit("deleteGroup", props.group);
};
const editGroup = () => {
  emit("editGroup", props.group);
};
</script>
