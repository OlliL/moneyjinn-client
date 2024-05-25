<template>
  <tr>
    <td class="text-start">{{ group.name }}</td>
    <td class="text-center">
      <span class="link-primary" @click="editGroup"
        ><i class="bi bi-pencil-square"></i
      ></span>
    </td>
    <td class="text-center">
      <span class="link-primary" @click="deleteGroup"><i class="bi bi-trash"></i></span
      >
    </td>
  </tr>
</template>
<script lang="ts" setup>
import type { PropType } from "vue";
import type { Group } from "@/model/group/Group";

const props = defineProps({
  group: {
    type: Object as PropType<Group>,
    required: true,
  },
});

const emit = defineEmits(["deleteGroup", "editGroup"]);

const deleteGroup = () => {
  emit("deleteGroup", props.group);
};
const editGroup = () => {
  emit("editGroup", props.group);
};
</script>
