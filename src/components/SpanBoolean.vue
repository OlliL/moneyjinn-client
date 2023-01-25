<template>
  <span
    ><b :style="'color:' + color">{{ text }}</b></span
  >
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
  value: {
    type: Boolean,
    required: false,
  },
});

const color = computed(() => {
  return props.value ? "green" : "red";
});

const text = computed(() => {
  return props.value ? "Ja" : "Nein";
});
</script>
