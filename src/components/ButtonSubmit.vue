<template>
  <button type="submit" class="btn btn-primary" :form="formId">
    <slot name="icon"></slot>{{ buttonLabel }}
  </button>
</template>

<script lang="ts" setup>
defineProps({
  buttonLabel: {
    type: String,
    required: true,
  },
  formId: {
    type: String,
    required: false,
  },
});
</script>
