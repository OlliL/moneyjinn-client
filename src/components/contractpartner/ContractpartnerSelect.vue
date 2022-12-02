<template>
  <CreateContractpartnerModalVue
    ref="createContractpartnerModal"
    @contractpartner-created="contractpartnerCreated"
  />

  <div class="input-group">
    <div class="form-floating">
      <select
        v-model="contractpartnerId"
        id="contractpartner"
        @change="emitContractpartnerSelected"
        :class="'form-select form-control ' + inputClass"
      >
        <option value="0">&nbsp;</option>
        <option
          v-for="contractpartner of contractpartnerArray"
          :key="contractpartner.id"
          :value="contractpartner.id"
        >
          {{ contractpartner.name }}
        </option>
      </select>

      <label for="contractpartner" :style="'color: ' + fieldColor">{{
        fieldLabel
      }}</label>
    </div>
    <span
      class="input-group-text"
      role="button"
      @click="async () => showCreateContractpartnerModal()"
      ><i class="bi bi-plus"></i
    ></span>
  </div>
</template>
<script lang="ts">
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import { useContractpartnerStore } from "@/stores/ContractpartnerStore";
import { mapActions } from "pinia";
import { defineComponent } from "vue";
import CreateContractpartnerModalVue from "./CreateContractpartnerModal.vue";

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
  computed: {
    contractpartnerArray(): Array<Contractpartner> {
      const contractpartnerStore = useContractpartnerStore();
      return contractpartnerStore.getValidContractpartner(this.validityDate);
    },
  },
  watch: {
    selectedId: {
      handler(newVal: number, oldVal: number) {
        if (newVal != oldVal) this.contractpartnerId = newVal;
      },
      immediate: true,
    },
  },
  created() {
    this.initContractpartnerStore();
  },
  methods: {
    ...mapActions(useContractpartnerStore, ["initContractpartnerStore"]),
    emitContractpartnerSelected() {
      console.log("emit");
      this.$emit(
        "contractpartnerSelected",
        this.contractpartnerArray.find((mcp) => {
          return mcp.id === +this.contractpartnerId;
        })
      );
    },
    showCreateContractpartnerModal() {
      (
        this.$refs
          .createContractpartnerModal as typeof CreateContractpartnerModalVue
      )._show();
    },
    async contractpartnerCreated(mcp: Contractpartner) {
      this.contractpartnerId = mcp.id;
      this.emitContractpartnerSelected();
    },
  },
  components: { CreateContractpartnerModalVue },
});
</script>
