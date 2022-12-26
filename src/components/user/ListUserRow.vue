<template>
  <tr>
    <td class="text-start">{{ user.userName }}</td>
    <td class="text-start">{{ user.groupName }}</td>
    <td class="text-center">
      <b :style="'color:' + userCanLoginColor">{{ userCanLoginString }}</b>
    </td>
    <td class="text-center">
      <b :style="'color:' + userIsAdminColor">{{ userIsAdminString }}</b>
    </td>
    <td class="text-center">
      <b :style="'color:' + userIsNewColor">{{ userIsNewString }}</b>
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
<script lang="ts">
import type { User } from "@/model/user/User";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  name: "ListUserRow",
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
  },
  emits: ["deleteUser", "editUser"],
  computed: {
    userCanLoginColor(): string {
      return this.user.userCanLogin ? "green" : "red";
    },
    userCanLoginString(): string {
      return this.user.userCanLogin ? "Ja" : "Nein";
    },
    userIsAdminColor(): string {
      return this.user.userIsAdmin ? "green" : "red";
    },
    userIsAdminString(): string {
      return this.user.userIsAdmin ? "Ja" : "Nein";
    },
    userIsNewColor(): string {
      return this.user.userIsNew ? "green" : "red";
    },
    userIsNewString(): string {
      return this.user.userIsNew ? "Ja" : "Nein";
    },
  },
  methods: {
    deleteUser() {
      this.$emit("deleteUser", this.user);
    },
    editUser() {
      this.$emit("editUser", this.user);
    },
  },
});
</script>
