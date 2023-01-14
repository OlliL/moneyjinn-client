<template>
  <CreateContractpartnerModalVue
    ref="createContractpartnerModal"
    :id-suffix="idSuffix"
    @contractpartner-created="contractpartnerCreated"
  />

  <div class="input-group">
    <div class="form-floating">
      <select
        v-model="contractpartnerId"
        :id="'contractpartner' + idSuffix"
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

      <label
        :for="'contractpartner' + idSuffix"
        :style="'color: ' + fieldColor"
        >{{ fieldLabel }}</label
      >
    </div>
    <span
      class="input-group-text"
      role="button"
      @click="async () => showCreateContractpartnerModal()"
      ><i class="bi bi-plus"></i
    ></span>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from "vue";

import CreateContractpartnerModalVue from "./CreateContractpartnerModal.vue";

import { useContractpartnerStore } from "@/stores/ContractpartnerStore";

import type { Contractpartner } from "@/model/contractpartner/Contractpartner";

const props = defineProps({
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
});

const contractpartnerId = ref(0);
const createContractpartnerModal = ref();
const emit = defineEmits(["contractpartnerSelected"]);

const contractpartnerArray = computed((): Array<Contractpartner> => {
  const contractpartnerStore = useContractpartnerStore();
  return contractpartnerStore.getValidContractpartner(props.validityDate);
});

const emitContractpartnerSelected = () => {
  emit(
    "contractpartnerSelected",
    contractpartnerArray.value.filter((mcs) => {
      return mcs.id === +contractpartnerId.value;
    })[0]
  );
};
const showCreateContractpartnerModal = () => {
  createContractpartnerModal.value._show();
};

const contractpartnerCreated = (mcs: Contractpartner) => {
  contractpartnerId.value = mcs.id;
  emitContractpartnerSelected();
};

watch(
  () => props.selectedId,
  (newVal, oldVal) => {
    if (newVal != oldVal) {
      if (newVal != oldVal) contractpartnerId.value = newVal ? newVal : 0;
    }
  },
  { immediate: true }
);
</script>
