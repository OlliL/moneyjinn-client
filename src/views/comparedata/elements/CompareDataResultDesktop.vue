<template>
  <DivContentTable :alternateRowBackground="false" class="w-full">
    <colgroup>
      <col style="width: 5%" />
      <col style="width: 5%" />
      <col style="width: 90%" />
    </colgroup>
    <TableHeader>
      <TableRow>
        <TableHead class="font-bold text-foreground text-center" colspan="3">
          {{ $t("CompareData.result") }}
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <CompareDataResultDesktopGroupVue
        :comment="$t('CompareData.dataInSourceNotInDb')"
        :compare-data="compareDatasNotInDatabase"
        group-test-id="compare-data-group-not-in-database"
        :amount-class="compareDatasNotInDatabaseCountClass"
        :capitalsource-id="capitalsourceId"
        :capitalsource-comment="capitalsourceComment"
        @create-moneyflow="$emit('createMoneyflow', $event)"
      />
      <CompareDataResultDesktopGroupVue
        :comment="$t('CompareData.dataNotInSourceInDb')"
        :compare-data="compareDatasNotInFile"
        group-test-id="compare-data-group-not-in-file"
        :amount-class="compareDatasNotInFileCountClass"
        :capitalsource-id="capitalsourceId"
        :capitalsource-comment="capitalsourceComment"
        @delete-moneyflow="$emit('deleteMoneyflow', $event)"
        @edit-moneyflow="$emit('editMoneyflow', $event)"
        @create-moneyflow="$emit('createMoneyflow', $event)"
      />
      <CompareDataResultDesktopGroupVue
        :comment="$t('CompareData.dataMatchingButWrongCapitalsource')"
        :compare-data="compareDatasWrongCapitalsource"
        group-test-id="compare-data-group-wrong-capitalsource"
        :amount-class="compareDatasWrongCapitalsourceCountClass"
        :capitalsource-id="capitalsourceId"
        :capitalsource-comment="capitalsourceComment"
        @delete-moneyflow="$emit('deleteMoneyflow', $event)"
        @edit-moneyflow="$emit('editMoneyflow', $event)"
        @create-moneyflow="$emit('createMoneyflow', $event)"
      />
      <CompareDataResultDesktopGroupVue
        :comment="$t('CompareData.dataMatching')"
        :compare-data="compareDatasMatching"
        group-test-id="compare-data-group-matching"
        :amount-class="compareDatasMatchingCountClass"
        :capitalsource-id="capitalsourceId"
        :capitalsource-comment="capitalsourceComment"
        @delete-moneyflow="$emit('deleteMoneyflow', $event)"
        @edit-moneyflow="$emit('editMoneyflow', $event)"
        @create-moneyflow="$emit('createMoneyflow', $event)"
      />
    </TableBody>
  </DivContentTable>
</template>

<script lang="ts" setup>
import DivContentTable from "@/components/common/DivContentTable.vue";
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CompareData } from "@/model/comparedata/CompareData";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { type PropType } from "vue";
import CompareDataResultDesktopGroupVue from "./CompareDataResultDesktopGroup.vue";

defineProps({
  compareDatasMatching: {
    type: Array as PropType<CompareData[]>,
    required: false,
  },
  compareDatasMatchingCountClass: { type: String, required: true },
  compareDatasWrongCapitalsource: {
    type: Array as PropType<CompareData[]>,
    required: false,
  },
  compareDatasWrongCapitalsourceCountClass: { type: String, required: true },
  compareDatasNotInFile: {
    type: Array as PropType<CompareData[]>,
    required: false,
  },
  compareDatasNotInFileCountClass: { type: String, required: true },
  compareDatasNotInDatabase: {
    type: Array as PropType<CompareData[]>,
    required: false,
  },
  compareDatasNotInDatabaseCountClass: { type: String, required: true },
  capitalsourceId: { type: Number, required: true },
  capitalsourceComment: { type: String, required: true },
});

defineEmits<{
  deleteMoneyflow: [id: number];
  editMoneyflow: [id: number];
  createMoneyflow: [moneyflow: Moneyflow];
}>();
</script>
