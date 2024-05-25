<template>
  <tr>
    <td class="text-start">{{ mpa.name }}</td>
    <td class="text-center">
      <span class="link-primary" @click="editPostingAccount"
        ><i class="bi bi-pencil-square"></i
      ></span>
    </td>
    <td class="text-center">
      <span class="link-primary" @click="deletePostingAccount"
        ><i class="bi bi-trash"></i
      ></span>
    </td>
  </tr>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";

import type { PostingAccount } from "@/model/postingaccount/PostingAccount";

const props = defineProps({
  mpa: {
    type: Object as PropType<PostingAccount>,
    required: true,
  },
});

const emit = defineEmits(["deletePostingAccount", "editPostingAccount"]);

const deletePostingAccount = () => {
  emit("deletePostingAccount", props.mpa);
};
const editPostingAccount = () => {
  emit("editPostingAccount", props.mpa);
};
</script>
