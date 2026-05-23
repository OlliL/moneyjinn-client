<template>
  <TableRow :data-testid="`capitalsource-row-${mcs.id}`">
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
    <ButtonTableIcon
      v-if="owner"
      :title="$t('General.edit')"
      :test-id="`capitalsource-edit-${mcs.id}`"
      @click="editCapitalsource"
    >
      <Pencil class="icon-small" />
    </ButtonTableIcon>
    <ButtonTableIcon
      v-if="owner"
      :title="$t('General.delete')"
      :test-id="`capitalsource-delete-${mcs.id}`"
      @click="deleteCapitalsource"
    >
      <Trash2 class="icon-small" />
    </ButtonTableIcon>
  </TableRow>
</template>
<script lang="ts" setup>
import { Pencil, Trash2 } from "lucide-vue-next";
import { computed, type PropType } from "vue";

import { TableCell, TableRow } from "@/components/ui/table";

import SpanDate from "@/components/common/SpanDate.vue";

import ButtonTableIcon from "@/components/common/ButtonTableIcon.vue";
import SpanBoolean from "@/components/common/SpanBoolean.vue";
import SpanIban from "@/components/common/SpanIban.vue";
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import { capitalsourceImportNames } from "@/model/capitalsource/CapitalsourceImport";
import { capitalsourceStateNames } from "@/model/capitalsource/CapitalsourceState";
import { capitalsourceTypeNames } from "@/model/capitalsource/CapitalsourceType";

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
