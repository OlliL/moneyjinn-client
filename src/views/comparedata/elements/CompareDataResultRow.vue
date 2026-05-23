<template>
  <TableRow v-if="mmf">
    <TableCell class="font-bold bg-muted border-r text-left">
      {{ $t("CompareData.database") }}
    </TableCell>
    <TableCell class="border-r"><SpanDate :date="mmf.bookingDate" /></TableCell>
    <TableCell class="border-r"><SpanDate :date="mmf.invoiceDate" /></TableCell>
    <TableCell class="text-right border-r"
      ><SpanAmount :amount="mmf.amount"
    /></TableCell>

    <TableCell class="text-left border-r !whitespace-normal break-words">
      {{ mmf.contractpartnerName }}
    </TableCell>
    <TableCell class="text-left border-r !whitespace-normal break-words">
      {{ mmf.comment }}
    </TableCell>

    <TableCell class="text-left border-r whitespace-nowrap">
      {{ mmf.capitalsourceComment }}
    </TableCell>

    <TableCell
      class="border whitespace-nowrap text-center p-0"
      v-if="isOwnMoneyflow"
    >
      <Button
        variant="ghost"
        size="icon"
        :data-testid="`compare-data-edit-${mmf.id}`"
        @click="editMoneyflow"
        :title="$t('General.edit')"
        class="action-icon-button"
      >
        <Pencil class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell
      class="border whitespace-nowrap border-l text-center p-0"
      v-if="isOwnMoneyflow"
    >
      <Button
        variant="ghost"
        size="icon"
        :data-testid="`compare-data-delete-${mmf.id}`"
        @click="deleteMoneyflow"
        :title="$t('General.delete')"
        class="action-icon-button"
      >
        <Trash2 class="h-4 w-4" />
      </Button>
    </TableCell>
  </TableRow>

  <TableRow v-if="importData">
    <TableCell class="font-bold bg-muted border-r text-left">
      {{ $t("CompareData.source") }}
    </TableCell>
    <TableCell class="border-r"
      ><SpanDate :date="importData.bookingDate"
    /></TableCell>
    <TableCell class="border-r"
      ><SpanDate :date="importData.invoiceDate"
    /></TableCell>
    <TableCell class="text-right border-r"
      ><SpanAmount :amount="importData.amount"
    /></TableCell>

    <TableCell
      class="text-left border-r !whitespace-normal break-words"
      v-if="importData.partner"
    >
      {{ importData.partner }}
    </TableCell>
    <TableCell class="text-left border-r !whitespace-normal break-words" v-else>
      <i>{{ importData.contractpartnerName }}</i>
    </TableCell>
    <TableCell class="text-left border-r !whitespace-normal break-words">
      <SpanImportComment :comment="importData.comment" />
    </TableCell>

    <TableCell class="text-left border-r whitespace-nowrap">
      {{ capitalsourceComment }}
    </TableCell>

    <TableCell class="whitespace-nowrap text-center p-0">
      <Button
        variant="ghost"
        size="icon"
        :data-testid="`compare-data-create-${rowIndex}`"
        @click="createMoneyflow"
        :title="$t('General.new')"
        class="action-icon-button"
      >
        <Plus class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell class="border-l"></TableCell>
  </TableRow>
  <TableRow class="border-b-2 border-black"></TableRow>
</template>
<script lang="ts" setup>
import { Pencil, Plus, Trash2 } from "lucide-vue-next";
import { computed, type PropType } from "vue";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

import SpanAmount from "@/components/common/SpanAmount.vue";
import SpanDate from "@/components/common/SpanDate.vue";

import { useUserSessionStore } from "@/stores/UserSessionStore";

import SpanImportComment from "@/components/common/SpanImportComment.vue";
import type { CompareDataDataset } from "@/model/comparedata/CompareDataDataset";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";

const props = defineProps({
  mmf: {
    type: Object as PropType<Moneyflow>,
    required: false,
  },
  importData: {
    type: Object as PropType<CompareDataDataset>,
    required: false,
  },
  capitalsourceId: {
    type: Number,
    required: true,
  },
  capitalsourceComment: {
    type: String,
    required: true,
  },
  rowIndex: {
    type: Number,
    required: true,
  },
});

const userSessionStore = useUserSessionStore();
const emit = defineEmits([
  "deleteMoneyflow",
  "editMoneyflow",
  "createMoneyflow",
]);

const isOwnMoneyflow = computed(() => {
  return props.mmf ? props.mmf.userId === userSessionStore.getUserId : false;
});

const deleteMoneyflow = () => {
  if (props.mmf) emit("deleteMoneyflow", props.mmf.id);
};
const editMoneyflow = () => {
  if (props.mmf) emit("editMoneyflow", props.mmf.id);
};
const createMoneyflow = () => {
  const moneyflowToCreate: Moneyflow = {
    id: 0,
    bookingDate: props.importData?.bookingDate,
    invoiceDate: props.importData?.invoiceDate,
    amount: props.importData?.amount,
    comment: props.importData?.moneyflowComment
      ? props.importData?.moneyflowComment
      : props.importData?.comment,
    capitalsourceId: props.capitalsourceId,
    contractpartnerId: props.importData?.contractpartnerId,
    contractpartnerName: props.importData?.contractpartnerName,
    postingAccountId: props.importData?.postingAccountId,
    postingAccountName: props.importData?.postingAccountName,
  } as Moneyflow;
  emit("createMoneyflow", moneyflowToCreate);
};
</script>
