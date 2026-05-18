<template>
  <TableRow>
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
    <ButtonTableIcon :title="$t('General.edit')" @click="editUser">
      <Pencil class="h-4 w-4" />
    </ButtonTableIcon>
    <ButtonTableIcon :title="$t('General.delete')" @click="deleteUser">
      <Trash2 class="h-4 w-4" />
    </ButtonTableIcon>
  </TableRow>
</template>
<script lang="ts" setup>
import { TableCell, TableRow } from "@/components/ui/table";
import type { User } from "@/model/user/User";
import { userRoleNames } from "@/model/user/UserRole";
import { Pencil, Trash2 } from "lucide-vue-next";
import { computed, type PropType } from "vue";
import ButtonTableIcon from "../ButtonTableIcon.vue";
import SpanBoolean from "../SpanBoolean.vue";

const props = defineProps({
  user: {
    type: Object as PropType<User>,
    required: true,
  },
});

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
