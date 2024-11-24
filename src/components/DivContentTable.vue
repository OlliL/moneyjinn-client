<template>
  <div class="row justify-content-md-center">
    <div :class="class">
      <table class="table table-striped table-bordered table-hover">
        <slot name="default"></slot>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  class: {
    type: String,
    default: "col-xxl-9 col-xs-12",
  },
});
</script>
