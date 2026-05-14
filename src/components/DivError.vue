<template>
  <div v-if="serverErrors && serverErrors.length > 0">
    <div
      class="mb-4 rounded-lg bg-red-50 p-4 text-center text-sm text-red-800 border border-red-200"
      v-for="(error, index) in serverErrors"
      :key="index"
    >
      {{ error }}
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  serverErrors: {
    type: Array<string>,
    required: false,
  },
});
</script>
