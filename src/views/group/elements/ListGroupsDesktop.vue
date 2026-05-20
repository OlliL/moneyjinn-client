<template>
  <div data-testid="group-desktop-table" class="hidden md:block">
    <DivContentTable class="max-w-sm">
      <TableHeader>
        <TableRow>
          <TableHead class="font-bold border-r text-foreground text-center">{{
            $t("General.name")
          }}</TableHead>
          <TableHead colspan="2"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <ListGroupRowVue
          v-for="group in groups"
          :key="group.id"
          :group="group"
          @edit-group="editGroup"
          @delete-group="deleteGroup"
        />
      </TableBody>
    </DivContentTable>
  </div>
</template>

<script lang="ts" setup>
import DivContentTable from "@/components/DivContentTable.vue";
import ListGroupRowVue from "./ListGroupRow.vue";
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Group } from "@/model/group/Group";
import type { PropType } from "vue";

defineProps({
  groups: {
    type: Array as PropType<Group[]>,
    required: true,
  },
});

const emit = defineEmits(["deleteGroup", "editGroup"]);

const deleteGroup = (group: Group) => {
  emit("deleteGroup", group);
};

const editGroup = (group: Group) => {
  emit("editGroup", group);
};
</script>

