<template>
  <TableRow>
    <TableCell class="text-left border-r">{{ mcs.comment }}</TableCell>
    <TableCell class="text-left border-r">{{ typeString }}</TableCell>
    <TableCell class="text-left border-r">{{ stateString }}</TableCell>
    <TableCell class="text-left border-r">{{ mcs.accountNumber }}</TableCell>
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
    <TableCell class="w-0 whitespace-nowrap text-center p-0" v-if="owner">
      <Button
        variant="ghost"
        size="icon"
        @click="editCapitalsource"
        :title="$t('General.edit')"
        class="h-8 w-8 cursor-pointer"
      >
        <Pencil class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell
      class="w-0 border-l whitespace-nowrap text-center p-0"
      v-if="owner"
    >
      <Button
        variant="ghost"
        size="icon"
        @click="deleteCapitalsource"
        :title="$t('General.delete')"
        class="h-8 w-8 cursor-pointer"
      >
        <Trash2 class="h-4 w-4" />
      </Button>
    </TableCell>
  </TableRow>
</template>
<script lang="ts" setup>
import { Pencil, Trash2 } from "lucide-vue-next";
import { computed, type PropType } from "vue";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

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
