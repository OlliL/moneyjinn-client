<template>
  <div class="input-group">
    <div class="form-floating">
      <select
        v-model="capitalsourceId"
        id="capitalsource"
        @change="emitCapitalsourceSelected"
        :class="'form-select form-control ' + inputClass"
      >
        <option value="0">&nbsp;</option>
        <option
          v-for="capitalsource of capitalsourceArray"
          :key="capitalsource.id"
          :value="capitalsource.id"
        >
          {{ capitalsource.comment }}
        </option>
      </select>

      <label for="capitalsource" :style="'color: ' + fieldColor">{{
        fieldLabel
      }}</label>
    </div>
    <span class="input-group-text"><i class="bi bi-plus"></i></span>
  </div>
</template>
<script lang="ts">
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import { useCapitalsourceStore } from "@/stores/CapitalsourceStore";
import { mapActions } from "pinia";
import { defineComponent } from "vue";

export default defineComponent({
  name: "CapitalsourceSelect",
  data() {
    return { capitalsourceId: 0 };
  },
  emits: ["capitalsourceSelected"],
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
  computed: {
    capitalsourceArray(): Array<Capitalsource> {
      const capitalsourceStore = useCapitalsourceStore();
      return capitalsourceStore.getBookableValidCapitalsources(
        this.validityDate
      );
    },
  },
  watch: {
    selectedId: function (newVal: number, oldVal: number) {
      if (newVal != oldVal) this.capitalsourceId = newVal;
    },
  },
  created() {
    this.initCapitalsourceStore();
  },
  methods: {
    ...mapActions(useCapitalsourceStore, ["initCapitalsourceStore"]),
    emitCapitalsourceSelected() {
      this.$emit("capitalsourceSelected", +this.capitalsourceId);
    },
  },
});
</script>
