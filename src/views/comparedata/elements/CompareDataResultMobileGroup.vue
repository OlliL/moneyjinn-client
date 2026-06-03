<template>
  <div
    v-if="!compareData || compareData.length === 0"
    class="py-12 text-center text-muted-foreground italic"
  >
    {{ $t("General.noEntries") }}
  </div>
  <Accordion v-else type="single" collapsible class="w-full space-y-2">
    <CompareDataResultMobileRow
      v-for="(data, idx) in compareData"
      :key="idx"
      :row-index="idx"
      :mmf="data.moneyflow"
      :import-data="data.compareDataDataset"
      :capitalsource-id="capitalsourceId"
      :capitalsource-comment="capitalsourceComment"
      @delete-moneyflow="$emit('deleteMoneyflow', $event)"
      @edit-moneyflow="$emit('editMoneyflow', $event)"
      @create-moneyflow="$emit('createMoneyflow', $event)"
    />
  </Accordion>
</template>

<script lang="ts" setup>
import { Accordion } from "@/components/ui/accordion";
import type { CompareData } from "@/model/comparedata/CompareData";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { type PropType } from "vue";
import CompareDataResultMobileRow from "./CompareDataResultMobileRow.vue";

defineProps<{
    compareData?: CompareData[];
    capitalsourceId: number;
    capitalsourceComment: string;
}>();

defineEmits<{
  deleteMoneyflow: [id: number];
  editMoneyflow: [id: number];
  createMoneyflow: [moneyflow: Moneyflow];
}>();
</script>
