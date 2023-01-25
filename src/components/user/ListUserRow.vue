<template>
  <tr>
    <td class="text-start">{{ user.userName }}</td>
    <td class="text-start">{{ user.groupName }}</td>
    <td class="text-center"><SpanBoolean :value="user.userCanLogin" /></td>
    <td class="text-center">
      <SpanBoolean :value="user.userIsAdmin" />
    </td>
    <td class="text-center">
      <SpanBoolean :value="user.userIsNew" />
    </td>
    <td class="text-center">
      <span role="button" class="link-primary" @click="editUser"
        >bearbeiten</span
      >
    </td>
    <td class="text-center">
      <span role="button" class="link-primary" @click="deleteUser"
        >l&ouml;schen</span
      >
    </td>
  </tr>
</template>
<script lang="ts" setup>
import type { PropType } from "vue";

import SpanBoolean from "../SpanBoolean.vue";

import type { User } from "@/model/user/User";

const props = defineProps({
  user: {
    type: Object as PropType<User>,
    required: true,
  },
});

const emit = defineEmits(["deleteUser", "editUser"]);

const deleteUser = () => {
  emit("deleteUser", props.user);
};
const editUser = () => {
  emit("editUser", props.user);
};
</script>
