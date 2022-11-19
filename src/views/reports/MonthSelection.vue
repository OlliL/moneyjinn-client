<template>{{ $props.year }} / {{ $props.month }}</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "BookListItem",
  props: {
    year: {
      type: String,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
  },
});
</script>
