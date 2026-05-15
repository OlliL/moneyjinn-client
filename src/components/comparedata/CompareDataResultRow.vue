<template>
  <TableRow v-if="mmf">
    <TableCell class="font-bold bg-primary/10 border-r text-left">
      {{ $t("CompareData.database") }}
    </TableCell>
    <TableCell><SpanDate :date="mmf.bookingDate" /></TableCell>
    <TableCell><SpanDate :date="mmf.invoiceDate" /></TableCell>
    <TableCell class="text-right"
      ><SpanAmount :amount="mmf.amount"
    /></TableCell>

    <TableCell class="text-left !whitespace-normal break-words">
      {{ mmf.contractpartnerName }}
    </TableCell>
    <TableCell class="text-left !whitespace-normal break-words">
      {{ mmf.comment }}
    </TableCell>

    <TableCell class="text-left whitespace-nowrap">
      {{ mmf.capitalsourceComment }}
    </TableCell>

    <TableCell
      class="border whitespace-nowrap text-center p-0"
      v-if="isOwnMoneyflow"
    >
      <Button
        variant="ghost"
        size="icon"
        @click="editMoneyflow"
        :title="$t('General.edit')"
        class="h-8 w-8 cursor-pointer"
      >
        <Pencil class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell
      class="border whitespace-nowrap text-center p-0"
      v-if="isOwnMoneyflow"
    >
      <Button
        variant="ghost"
        size="icon"
        @click="deleteMoneyflow"
        :title="$t('General.delete')"
        class="h-8 w-8 cursor-pointer"
      >
        <Trash2 class="h-4 w-4" />
      </Button>
    </TableCell>
  </TableRow>

  <TableRow v-if="importData">
    <TableCell class="font-bold bg-primary/10 border-r text-left">
      {{ $t("CompareData.source") }}
    </TableCell>
    <TableCell><SpanDate :date="importData.bookingDate" /></TableCell>
    <TableCell><SpanDate :date="importData.invoiceDate" /></TableCell>
    <TableCell class="text-right"
      ><SpanAmount :amount="importData.amount"
    /></TableCell>

    <TableCell
      class="text-left !whitespace-normal break-words"
      v-if="importData.partner"
    >
      {{ importData.partner }}
    </TableCell>
    <TableCell class="text-left !whitespace-normal break-words" v-else>
      <i>{{ importData.contractpartnerName }}</i>
    </TableCell>
    <TableCell class="text-left !whitespace-normal break-words">
      {{ importData.comment }}
    </TableCell>

    <TableCell class="text-left whitespace-nowrap">
      {{ capitalsourceComment }}
    </TableCell>

    <TableCell class="border whitespace-nowrap text-center p-0">
      <Button
        variant="ghost"
        size="icon"
        @click="createMoneyflow"
        :title="$t('General.create')"
        class="h-8 w-8 cursor-pointer"
      >
        <Plus class="h-4 w-4" />
      </Button>
    </TableCell>
    <TableCell class="border"></TableCell>
  </TableRow>
  <TableRow class="border-b-2 border-black"></TableRow>
</template>
<script lang="ts" setup>
import { computed, type PropType } from "vue";
import { Pencil, Trash2, Plus } from "lucide-vue-next";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import SpanAmount from "../SpanAmount.vue";
import SpanDate from "../SpanDate.vue";

import { useUserSessionStore } from "@/stores/UserSessionStore";

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
