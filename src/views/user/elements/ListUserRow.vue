<template>
  <TableRow :data-testid="`user-row-${user.id}`">
    <TableCell class="text-left border-r py-1 px-2">{{
      user.userName
    }}</TableCell>
    <TableCell class="text-left border-r py-1 px-2">{{
      user.groupName
    }}</TableCell>
    <TableCell class="text-center border-r py-1 px-2">{{ role }}</TableCell>
    <TableCell class="text-center border-r py-1 px-2">
      <SpanBoolean :value="user.userIsNew" />
    </TableCell>
    <ButtonTableIcon
      :title="$t('General.edit')"
      :test-id="`user-edit-${user.id}`"
      @click="editUser"
    >
      <Pencil class="icon-medium" />
    </ButtonTableIcon>
    <ButtonTableIcon
      :title="$t('General.delete')"
      :test-id="`user-delete-${user.id}`"
      @click="deleteUser"
    >
      <Trash2 class="icon-medium" />
    </ButtonTableIcon>
  </TableRow>
</template>
<script lang="ts" setup>
import ButtonTableIcon from "@/components/common/ButtonTableIcon.vue";
import SpanBoolean from "@/components/common/SpanBoolean.vue";
import { TableCell, TableRow } from "@/components/ui/table";
import type { User } from "@/model/user/User";
import { userRoleNames } from "@/model/user/UserRole";
import { Pencil, Trash2 } from "lucide-vue-next";
import { computed, type PropType } from "vue";

const props = defineProps<{
    user: User;
}>();

const role = computed(() => {
  return userRoleNames[props.user.role];
});

const emit = defineEmits(["deleteUser", "editUser"]);

const deleteUser = () => {
  emit("deleteUser", props.user);
};
const editUser = () => {
  emit("editUser", props.user);
};
</script>
