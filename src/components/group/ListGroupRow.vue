<template>
  <tr>
    <td class="text-start">{{ group.name }}</td>
    <td class="text-center">
      <span role="button" class="link-primary" @click="editGroup"
        >bearbeiten</span
      >
    </td>
    <td class="text-center">
      <span role="button" class="link-primary" @click="deleteGroup"
        >l&ouml;schen</span
      >
    </td>
  </tr>
</template>
<script lang="ts">
import type { Group } from "@/model/group/Group";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  name: "ListGroupRow",
  props: {
    group: {
      type: Object as PropType<Group>,
      required: true,
    },
  },
  emits: ["deleteGroup", "editGroup"],
  computed: {},
  methods: {
    deleteGroup() {
      this.$emit("deleteGroup", this.group);
    },
    editGroup() {
      this.$emit("editGroup", this.group);
    },
  },
});
</script>
