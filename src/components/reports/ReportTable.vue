<template>
  <div class="row" style="margin-top: 20px">
    <div class="col">{{ $props.year }} / {{ $props.month }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ReportTable",
  data() {
    return {};
  },
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
  created() {
    this.loadData(this.$props.year, this.$props.month);
    this.$watch(
      () => ({
        year: this.year,
        month: this.month,
      }),
      (data) => {
        if (data.year && data.month) this.loadData(data.year, data.month);
      }
    );
  },
  methods: {
    async loadData(year?: string, month?: string) {
      console.log("ReportTable loading for:", year, month);
    },
  },
});
</script>
