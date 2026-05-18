<template>
  <TableRow>
    <TableCell class="text-left border-r">{{ mcs.comment }}</TableCell>
    <TableCell class="text-left border-r">{{ typeString }}</TableCell>
    <TableCell class="text-left border-r">{{ stateString }}</TableCell>
    <TableCell class="text-left border-r"
      ><SpanIban :iban="mcs.accountNumber"
    /></TableCell>
    <TableCell class="text-left border-r">{{ mcs.bankCode }}</TableCell>
    <TableCell class="text-left border-r"
      ><SpanDate :date="mcs.validFrom"
    /></TableCell>
    <TableCell class="text-left border-r"
      ><SpanDate :date="mcs.validTil"
    /></TableCell>
    <TableCell class="text-center border-r"
      ><SpanBoolean :value="mcs.groupUse"
    /></TableCell>
    <TableCell class="text-center border-r">
      <b :class="importAllowedColorClass">{{ importAllowedString }}</b>
    </TableCell>
    <TableActionButton
      v-if="owner"
      :title="$t('General.edit')"
      @click="editCapitalsource"
    >
      <Pencil class="h-4 w-4" />
    </TableActionButton>
    <TableActionButton
      v-if="owner"
      :title="$t('General.delete')"
      @click="deleteCapitalsource"
    >
      <Trash2 class="h-4 w-4" />
    </TableActionButton>
  </TableRow>
</template>
<script lang="ts" setup>
import { Pencil, Trash2 } from "lucide-vue-next";
import { computed, type PropType } from "vue";

import { TableCell, TableRow } from "@/components/ui/table";

import SpanDate from "../SpanDate.vue";

import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import { capitalsourceImportNames } from "@/model/capitalsource/CapitalsourceImport";
import { capitalsourceStateNames } from "@/model/capitalsource/CapitalsourceState";
import { capitalsourceTypeNames } from "@/model/capitalsource/CapitalsourceType";
import SpanBoolean from "../SpanBoolean.vue";
import SpanIban from "../SpanIban.vue";
import TableActionButton from "../TableActionButton.vue";

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

const importAllowedColorClass = computed(() => {
  return props.mcs.importAllowed > 0 ? "text-green-600" : "text-red-600";
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
