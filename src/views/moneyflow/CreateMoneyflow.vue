<template>
  <EditMoneyflowVue />
</template>
<script lang="ts">
import { defineComponent } from "vue";
import EditMoneyflowVue from "./EditMoneyflow.vue";

export default defineComponent({
  name: "CreateMoneyflow",
  components: { EditMoneyflowVue },
});
</script>
