<template>
  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>Ausgabenauswertung</h4>
      </div>
    </div>
    <div class="row justify-content-md-center mb-4"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ShowReporting",
  data() {
    return {
      dataLoaded: false,
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.dataLoaded = false;

      this.dataLoaded = true;
    },
  },
  components: {},
});
</script>

<style>
ul.month-selection {
  margin: 0 !important;
}
</style>
