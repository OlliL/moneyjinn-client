<template>
  <CreateCapitalsourceModalVue
    ref="createCapitalsourceModal"
    :id-suffix="idSuffix"
    @capitalsource-created="capitalsourceCreated"
  />

  <div class="input-group">
    <div class="form-floating">
      <select
        v-model="capitalsourceId"
        :id="'capitalsource' + idSuffix"
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

      <label
        :for="'capitalsource' + idSuffix"
        :style="'color: ' + fieldColor"
        >{{ fieldLabel }}</label
      >
    </div>
    <span
      class="input-group-text"
      role="button"
      @click="showCreateCapitalsourceModal"
      ><i class="bi bi-plus"></i
    ></span>
  </div>
</template>
<script lang="ts">
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import { useCapitalsourceStore } from "@/stores/CapitalsourceStore";
import { mapActions } from "pinia";
import { defineComponent } from "vue";
import CreateCapitalsourceModalVue from "./CreateCapitalsourceModal.vue";

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
    idSuffix: {
      type: String,
      default: "",
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
    selectedId: {
      handler(newVal: number, oldVal: number) {
        if (newVal != oldVal) this.capitalsourceId = newVal;
      },
      immediate: true,
    },
  },
  created() {
    this.initCapitalsourceStore();
  },
  methods: {
    ...mapActions(useCapitalsourceStore, ["initCapitalsourceStore"]),
    emitCapitalsourceSelected() {
      this.$emit(
        "capitalsourceSelected",
        this.capitalsourceArray.filter((mcs) => {
          return mcs.id === +this.capitalsourceId;
        })[0]
      );
    },
    showCreateCapitalsourceModal() {
      (
        this.$refs
          .createCapitalsourceModal as typeof CreateCapitalsourceModalVue
      )._show();
    },
    capitalsourceCreated(mcs: Capitalsource) {
      this.capitalsourceId = mcs.id;
      this.emitCapitalsourceSelected();
    },
  },
  components: { CreateCapitalsourceModalVue },
});
</script>
