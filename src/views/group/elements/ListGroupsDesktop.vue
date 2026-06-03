<template>
  <div data-testid="group-desktop-table" class="hidden md:block">
    <DivContentTable class="max-w-sm">
      <TableHeader>
        <TableRow>
          <TableHead class="table-head-cell">{{
            $t("General.name")
          }}</TableHead>
          <TableHead colspan="2"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <!-- Show empty state if no groups -->
        <TableRow v-if="groups.length === 0" data-testid="group-empty-desktop">
          <TableCell colspan="3" class="text-center text-muted-foreground">
            {{ $t("General.noEntries") }}
          </TableCell>
        </TableRow>
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
import DivContentTable from "@/components/common/DivContentTable.vue";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Group } from "@/model/group/Group";
import ListGroupRowVue from "./ListGroupRow.vue";

defineProps<{
  groups: Group[];
}>();

const emit = defineEmits<{
  deleteGroup: [group: Group];
  editGroup: [group: Group];
}>();

const deleteGroup = (group: Group) => {
  emit("deleteGroup", group);
};

const editGroup = (group: Group) => {
  emit("editGroup", group);
};
</script>
