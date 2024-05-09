<template>
  <div v-if="serverErrors">
    <div
      class="alert alert-danger text-center"
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
