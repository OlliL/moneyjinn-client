<template>
  <tr>
    <td class="text-start">{{ user.userName }}</td>
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
  computed: {},
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
