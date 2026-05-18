<template>
  <TableRow>
    <TableCell class="text-left border-r">{{ group.name }}</TableCell>
    <TableActionButton :title="$t('General.edit')" @click="editGroup">
        <Pencil class="h-4 w-4" />
    </TableActionButton>
    <TableActionButton
      :title="$t('General.delete')"
      cell-class="w-0 border-l whitespace-nowrap text-center p-0"
      @click="deleteGroup"
    >
        <Trash2 class="h-4 w-4" />
    </TableActionButton>
  </TableRow>
</template>
<script lang="ts" setup>
import { TableCell, TableRow } from "@/components/ui/table";
import type { Group } from "@/model/group/Group";
import { Pencil, Trash2 } from "lucide-vue-next";
import type { PropType } from "vue";
import TableActionButton from "../TableActionButton.vue";

const props = defineProps({
  group: {
    type: Object as PropType<Group>,
    required: true,
  },
});

const emit = defineEmits(["deleteGroup", "editGroup"]);

const deleteGroup = () => {
  emit("deleteGroup", props.group);
};
const editGroup = () => {
  emit("editGroup", props.group);
};
</script>
