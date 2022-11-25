<template>
  <div class="input-group">
    <div class="form-floating">
      <select
        v-model="contractpartnerId"
        id="contractpartner"
        @change="emitContractpartnerSelected"
        :class="'form-select form-control ' + inputClass"
      >
        <option value="0">&nbsp;</option>
        <option value="1">1</option>
        <option value="2">2</option>
      </select>

      <label for="contractpartner" :style="'color: ' + fieldColor">{{
        fieldLabel
      }}</label>
    </div>
    <span class="input-group-text"><i class="bi bi-plus"></i></span>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ContractpartnerSelect",
  data() {
    return { contractpartnerId: 0 };
  },
  emits: ["contractpartnerSelected"],
  props: {
    validityDate: {
      type: Date,
      required: true,
    },
    selectedId: {
      type: Number,
      required: false,
    },
    inputClass: {
      type: String,
      required: true,
    },
    fieldColor: {
      type: String,
      required: true,
    },
    fieldLabel: {
      type: String,
      required: true,
    },
  },
  watch: {
    selectedId: function (newVal: number, oldVal: number) {
      if (newVal != oldVal) this.contractpartnerId = newVal;
    },
  },
  methods: {
    emitContractpartnerSelected() {
      this.$emit("contractpartnerSelected", +this.contractpartnerId);
    },
  },
});
</script>
