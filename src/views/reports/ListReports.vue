<template>
  <div class="container-fluid text-center">
    <h4>Reports</h4>
    <MonthSelectionVue :year="year" :month="month" />
    <!--@month-changed="onMonthChanged"-->
    <ReportTableVue :year="year" :month="month" v-if="year && month" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MonthSelectionVue from "@/components/reports/MonthSelection.vue";
import ReportTableVue from "@/components/reports/ReportTable.vue";
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
  /*  methods: {
    onMonthChanged(year: string, month: string) {
      console.log(year + "-" + month);
    },
  },
  */
  components: { MonthSelectionVue, ReportTableVue },
});
</script>
