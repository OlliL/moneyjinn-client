<template>
  <div class="container-fluid text-center">
    <h4>Reports</h4>
    <MonthSelectionVue :year="year" :month="month" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MonthSelectionVue from "./MonthSelection.vue";
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
  components: { MonthSelectionVue },
});
</script>
