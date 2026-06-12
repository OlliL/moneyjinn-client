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
      @click="actions.edit(mcs)"
    >
      <Pencil class="icon-medium" />
    </ButtonTableIcon>
    <ButtonTableIcon
      v-if="owner"
      :title="$t('General.delete')"
      :test-id="`capitalsource-delete-${mcs.id}`"
      @click="actions.delete(mcs)"
    >
      <Trash2 class="icon-medium" />
    </ButtonTableIcon>
  </TableRow>
</template>
<script lang="ts" setup>
import ButtonTableIcon from "@/components/common/ButtonTableIcon.vue";
import SpanBoolean from "@/components/common/SpanBoolean.vue";
import SpanDate from "@/components/common/SpanDate.vue";
import SpanIban from "@/components/common/SpanIban.vue";
import { TableCell, TableRow } from "@/components/ui/table";
import { CapitalsourceActionsKey } from "@/model/CrudActions";
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import { capitalsourceImportNames } from "@/model/capitalsource/CapitalsourceImport";
import { capitalsourceStateNames } from "@/model/capitalsource/CapitalsourceState";
import { capitalsourceTypeNames } from "@/model/capitalsource/CapitalsourceType";
import { Pencil, Trash2 } from "@lucide/vue";
import { computed, inject } from "vue";

const actions = inject(CapitalsourceActionsKey)!;
const props = defineProps<{
  mcs: Capitalsource;
  owner: boolean;
}>();

const importAllowedColorClass = computed(() =>
  props.mcs.importAllowed > 0 ? "text-green-600" : "text-red-600",
);
const importAllowedString = computed(
  () => capitalsourceImportNames[props.mcs.importAllowed],
);
const typeString = computed(() => capitalsourceTypeNames[props.mcs.type]);
const stateString = computed(() => capitalsourceStateNames[props.mcs.state]);
</script>
