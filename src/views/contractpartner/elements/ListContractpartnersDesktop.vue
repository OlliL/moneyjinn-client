<template>
  <div data-testid="contractpartner-desktop-table" class="hidden md:block">
    <DivContentTable class="max-w-5xl">
      <TableHeader>
        <TableRow>
          <TableHead class="font-bold border-r text-foreground text-center">
            {{ $t("General.name") }}
          </TableHead>
          <TableHead class="font-bold border-r text-foreground text-center">
            {{ $t("General.validFrom") }}
          </TableHead>
          <TableHead class="font-bold border-r text-foreground text-center">
            {{ $t("General.validTil") }}
          </TableHead>
          <TableHead class="font-bold border-r text-foreground text-center">
            {{ $t("Contractpartner.moneyflowComment") }}
          </TableHead>
          <TableHead class="font-bold border-r text-foreground text-center">
            {{ $t("General.postingAccount") }}
          </TableHead>
          <TableHead colspan="3"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="contractpartners.length === 0" data-testid="contractpartner-empty-desktop">
          <TableCell colspan="8" class="text-center text-muted-foreground">
            {{ $t('General.noEntries') }}
          </TableCell>
        </TableRow>
        <ListContractpartnerRowVue
          v-for="mcp in contractpartners"
          :key="mcp.id"
          v-memo="[mcp.id]"
          :mcp="mcp"
          @delete-contractpartner="deleteContractpartner"
          @edit-contractpartner="editContractpartner"
          @list-contractpartner-accounts="listContractpartnerAccounts"
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
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import type { PropType } from "vue";
import ListContractpartnerRowVue from "./ListContractpartnerRow.vue";

defineProps({
  contractpartners: {
    type: Array as PropType<Contractpartner[]>,
    required: true,
  },
});

const emit = defineEmits([
  "deleteContractpartner",
  "editContractpartner",
  "listContractpartnerAccounts",
]);

const deleteContractpartner = (mcp: Contractpartner) => {
  emit("deleteContractpartner", mcp);
};

const editContractpartner = (mcp: Contractpartner) => {
  emit("editContractpartner", mcp);
};

const listContractpartnerAccounts = (mcp: Contractpartner) => {
  emit("listContractpartnerAccounts", mcp);
};
</script>
