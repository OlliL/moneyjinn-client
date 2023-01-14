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
<script lang="ts" setup>
import { computed, ref, watch } from "vue";

import CreateCapitalsourceModalVue from "./CreateCapitalsourceModal.vue";

import { useCapitalsourceStore } from "@/stores/CapitalsourceStore";

import type { Capitalsource } from "@/model/capitalsource/Capitalsource";

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

const capitalsourceId = ref(0);
const createCapitalsourceModal = ref();
const emit = defineEmits(["capitalsourceSelected"]);

const capitalsourceArray = computed((): Array<Capitalsource> => {
  const capitalsourceStore = useCapitalsourceStore();
  return capitalsourceStore.getBookableValidCapitalsources(props.validityDate);
});

const emitCapitalsourceSelected = () => {
  emit(
    "capitalsourceSelected",
    capitalsourceArray.value.filter((mcs) => {
      return mcs.id === +capitalsourceId.value;
    })[0]
  );
};
const showCreateCapitalsourceModal = () => {
  createCapitalsourceModal.value._show();
};

const capitalsourceCreated = (mcs: Capitalsource) => {
  capitalsourceId.value = mcs.id;
  emitCapitalsourceSelected();
};

watch(
  () => props.selectedId,
  (newVal, oldVal) => {
    if (newVal != oldVal) {
      if (newVal != oldVal) capitalsourceId.value = newVal ? newVal : 0;
    }
  },
  { immediate: true }
);
</script>
