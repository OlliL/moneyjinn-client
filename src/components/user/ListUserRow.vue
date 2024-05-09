<template>
  <tr>
    <td class="text-start">{{ user.userName }}</td>
    <td class="text-start">{{ user.groupName }}</td>
    <td class="text-center">{{ role }}</td>
    <td class="text-center">
      <SpanBoolean :value="user.userIsNew" />
    </td>
    <td class="text-center">
      <span class="link-primary" @click="editUser">{{
        $t("General.edit")
      }}</span>
    </td>
    <td class="text-center">
      <span class="link-primary" @click="deleteUser">{{
        $t("General.delete")
      }}</span>
    </td>
  </tr>
</template>
<script lang="ts" setup>
import { computed, type PropType } from "vue";

import SpanBoolean from "../SpanBoolean.vue";

import type { User } from "@/model/user/User";
import { userRoleNames } from "@/model/user/UserRole";

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
