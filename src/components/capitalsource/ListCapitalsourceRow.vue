<template>
  <tr>
    <td class="text-start">{{ mcs.comment }}</td>
    <td class="text-start">{{ typeString }}</td>
    <td class="text-start">{{ stateString }}</td>
    <td class="text-start">{{ mcs.accountNumber }}</td>
    <td class="text-start">{{ mcs.bankCode }}</td>
    <td class="text-start"><SpanDate :date="mcs.validFrom" /></td>
    <td class="text-start"><SpanDate :date="mcs.validTil" /></td>
    <td class="text-center"><SpanBoolean :value="mcs.groupUse" /></td>
    <td class="text-center">
      <b :style="'color:' + importAllowedColor">{{ importAllowedString }}</b>
    </td>
    <td class="text-center" v-if="owner">
      <span class="link-primary" @click="editCapitalsource"
        ><i class="bi bi-pencil-square"></i
      ></span>
    </td>
    <td class="text-center" v-if="owner">
      <span class="link-primary" @click="deleteCapitalsource"
        ><i class="bi bi-trash"></i
      ></span>
    </td>
  </tr>
</template>
<script lang="ts" setup>
import { computed, type PropType } from "vue";

import SpanDate from "../SpanDate.vue";

import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import { capitalsourceImportNames } from "@/model/capitalsource/CapitalsourceImport";
import { capitalsourceStateNames } from "@/model/capitalsource/CapitalsourceState";
import { capitalsourceTypeNames } from "@/model/capitalsource/CapitalsourceType";
import SpanBoolean from "../SpanBoolean.vue";

const props = defineProps({
  mcs: {
    type: Object as PropType<Capitalsource>,
    required: true,
  },
  owner: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["deleteCapitalsource", "editCapitalsource"]);

const importAllowedColor = computed(() => {
  return props.mcs.importAllowed > 0 ? "green" : "red";
});

const importAllowedString = computed(() => {
  return capitalsourceImportNames[props.mcs.importAllowed];
});

const typeString = computed(() => {
  return capitalsourceTypeNames[props.mcs.type];
});

const stateString = computed(() => {
  return capitalsourceStateNames[props.mcs.state];
});

const deleteCapitalsource = () => {
  emit("deleteCapitalsource", props.mcs);
};

const editCapitalsource = () => {
  emit("editCapitalsource", props.mcs);
};
</script>
