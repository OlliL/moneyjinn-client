<template>
  <TableRow>
    <TableCell class="text-left border-r">{{ group.name }}</TableCell>
    <TableCell class="w-0 whitespace-nowrap text-center p-0">
      <Button
        variant="ghost"
        size="icon"
        @click="editGroup"
        :title="$t('General.edit')"
        class="h-8 w-8 cursor-pointer"
      >
        <Pencil class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell class="w-0 border-l whitespace-nowrap text-center p-0">
      <Button
        variant="ghost"
        size="icon"
        @click="deleteGroup"
        :title="$t('General.delete')"
        class="h-8 w-8 cursor-pointer"
      >
        <Trash2 class="h-4 w-4" />
      </Button>
    </TableCell>
  </TableRow>
</template>
<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { Group } from "@/model/group/Group";
import { Pencil, Trash2 } from "lucide-vue-next";
import type { PropType } from "vue";

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
