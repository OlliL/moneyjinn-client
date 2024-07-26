<template>
  <div class="input-group">
    <div class="form-floating">
      <input type="text" :id="getId" name="haha" /><br />
      <b>{{ props.errorMessage }}</b>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: undefined,
    required: false,
  },
  errorMessage: {
    type: String,
    required: false,
  },
});
const getId = computed((): string => {
  return "id-" + Math.floor(Math.random() * 1000);
});
</script>
