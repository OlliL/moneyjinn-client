<template>
  <TableRow :data-testid="`predef-moneyflow-row-${mpm.id}`">
    <TableCell class="text-center border-r px-0">
      <FavoriteIcon
        v-if="mpm.isFavorite"
        :text="mpm.favoriteAbbreviation"
        :color="mpm.favoriteColor"
        size="sm"
        class="mx-auto"
      />
    </TableCell>
    <TableCell class="text-right border-r py-1 px-2">
      <SpanAmount :amount="mpm.amount" />
    </TableCell>
    <TableCell class="text-left border-r py-1 px-2">
      {{ mpm.contractpartnerName }}
    </TableCell>
    <TableCell class="text-left border-r py-1 px-2">
      {{ mpm.comment }}
    </TableCell>
    <TableCell class="text-left border-r py-1 px-2">
      {{ mpm.postingAccountName }}
    </TableCell>
    <TableCell class="text-left border-r py-1 px-2">
      {{ mpm.capitalsourceComment }}
    </TableCell>
    <TableCell class="text-center border-r py-1 px-2">
      <SpanBoolean :value="mpm.onceAMonth" />
    </TableCell>

    <TableCell class="text-center border-r py-1 px-2">
      <SpanDate :date="mpm.createDate" />
    </TableCell>
    <TableCell class="text-center border-r py-1 px-2">
      <SpanDate :date="mpm.lastUsed" />
    </TableCell>
    <ButtonTableIcon
      :title="$t('General.edit')"
      :test-id="`predef-moneyflow-edit-${mpm.id}`"
      @click="editPreDefMoneyflow"
    >
      <Pencil class="icon-medium" />
    </ButtonTableIcon>
    <ButtonTableIcon
      :title="$t('General.delete')"
      :test-id="`predef-moneyflow-delete-${mpm.id}`"
      @click="deletePreDefMoneyflow"
    >
      <Trash2 class="icon-medium" />
    </ButtonTableIcon>
  </TableRow>
</template>
<script lang="ts" setup>
import ButtonTableIcon from "@/components/common/ButtonTableIcon.vue";
import FavoriteIcon from "@/components/common/FavoriteIcon.vue";
import SpanAmount from "@/components/common/SpanAmount.vue";
import SpanBoolean from "@/components/common/SpanBoolean.vue";
import SpanDate from "@/components/common/SpanDate.vue";
import { TableCell, TableRow } from "@/components/ui/table";
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import { Pencil, Trash2 } from "lucide-vue-next";
import type { PropType } from "vue";

const props = defineProps({
  mpm: {
    type: Object as PropType<PreDefMoneyflow>,
    required: true,
  },
});
const emit = defineEmits(["deletePreDefMoneyflow", "editPreDefMoneyflow"]);

const deletePreDefMoneyflow = () => {
  emit("deletePreDefMoneyflow", props.mpm);
};

const editPreDefMoneyflow = () => {
  emit("editPreDefMoneyflow", props.mpm);
};
</script>
