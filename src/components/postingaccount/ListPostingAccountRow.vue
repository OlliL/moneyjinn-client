<template>
  <tr>
    <td class="text-start">{{ mpa.name }}</td>
    <td class="text-center">
      <span role="button" class="link-primary" @click="editPostingAccount"
        >bearbeiten</span
      >
    </td>
    <td class="text-center">
      <span role="button" class="link-primary" @click="deletePostingAccount"
        >l&ouml;schen</span
      >
    </td>
  </tr>
</template>
<script lang="ts">
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  name: "ListPostingAccountRow",
  props: {
    mpa: {
      type: Object as PropType<PostingAccount>,
      required: true,
    },
  },
  emits: ["deletePostingAccount", "editPostingAccount"],
  computed: {},
  methods: {
    deletePostingAccount() {
      this.$emit("deletePostingAccount", this.mpa);
    },
    editPostingAccount() {
      this.$emit("editPostingAccount", this.mpa);
    },
  },
});
</script>
