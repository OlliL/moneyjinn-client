<template>
  <TableRow>
    <TableCell class="text-left border py-1 px-2">{{ group.name }}</TableCell>
    <TableCell class="text-center border py-0 px-1 w-[40px]">
      <Button
        variant="ghost"
        size="icon"
        @click="editGroup"
        :title="$t('General.edit')"
        class="group hover:bg-transparent h-8 w-8"
      >
        <Pencil
          class="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors"
        />
      </Button>
    </TableCell>
    <TableCell class="text-center border py-0 px-1 w-[40px]">
      <Button
        variant="ghost"
        size="icon"
        @click="deleteGroup"
        :title="$t('General.delete')"
        class="group hover:bg-transparent h-8 w-8"
      >
        <Trash2
          class="h-4 w-4 text-muted-foreground group-hover:text-destructive transition-colors"
        />
      </Button>
    </TableCell>
  </TableRow>
</template>
<script lang="ts" setup>
import type { PropType } from "vue";
import { Pencil, Trash2 } from "lucide-vue-next";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import type { Group } from "@/model/group/Group";

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
