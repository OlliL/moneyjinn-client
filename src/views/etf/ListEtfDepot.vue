<template>
  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>ETF Depot</h4>
      </div>
    </div>
    <div class="row justify-content-md-center mb-4">
      <div class="col-md-9 col-xs-12"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ListEtfs",
  data() {
    return {
      dataLoaded: false,
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {},
  },
  components: {},
});
</script>