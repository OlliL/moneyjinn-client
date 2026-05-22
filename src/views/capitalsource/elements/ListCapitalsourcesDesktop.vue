<template>
  <div data-testid="capitalsource-desktop-table" class="hidden md:block">
    <DivContentTable>
      <TableHeader>
        <TableRow>
          <TableHead class="font-bold border-r text-foreground text-center">{{
            $t("General.name")
          }}</TableHead>
          <TableHead class="font-bold border-r text-foreground text-center">{{
            $t("Capitalsource.type")
          }}</TableHead>
          <TableHead class="font-bold border-r text-foreground text-center">{{
            $t("Capitalsource.state")
          }}</TableHead>
          <TableHead class="font-bold border-r text-foreground text-center">{{
            $t("General.iban")
          }}</TableHead>
          <TableHead class="font-bold border-r text-foreground text-center">{{
            $t("General.bic")
          }}</TableHead>
          <TableHead class="font-bold border-r text-foreground text-center">{{
            $t("General.validFrom")
          }}</TableHead>
          <TableHead class="font-bold border-r text-foreground text-center">{{
            $t("General.validTil")
          }}</TableHead>
          <TableHead class="font-bold border-r text-foreground text-center">{{
            $t("Capitalsource.groupUse")
          }}</TableHead>
          <TableHead class="font-bold border-r text-foreground text-center">{{
            $t("Capitalsource.importAllowed")
          }}</TableHead>
          <TableHead colspan="2"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <!-- Show empty state if no capitalsources -->
        <TableRow
          v-if="capitalsources.length === 0"
          data-testid="capitalsource-empty-desktop"
        >
          <TableCell colspan="12" class="text-center text-muted-foreground">
            {{ $t("General.noEntries") }}
          </TableCell>
        </TableRow>
        <ListCapitalsourceRowVue
          v-for="mcs in capitalsources"
          :key="mcs.id"
          :mcs="mcs"
          :owner="mcs.userId === userId"
          @delete-capitalsource="deleteCapitalsource"
          @edit-capitalsource="editCapitalsource"
        />
      </TableBody>
    </DivContentTable>
  </div>
</template>

<script lang="ts" setup>
import DivContentTable from "@/components/DivContentTable.vue";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import type { PropType } from "vue";
import ListCapitalsourceRowVue from "./ListCapitalsourceRow.vue";

defineProps({
  capitalsources: {
    type: Array as PropType<Capitalsource[]>,
    required: true,
  },
  userId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["deleteCapitalsource", "editCapitalsource"]);

const deleteCapitalsource = (mcs: Capitalsource) => {
  emit("deleteCapitalsource", mcs);
};

const editCapitalsource = (mcs: Capitalsource) => {
  emit("editCapitalsource", mcs);
};
</script>
