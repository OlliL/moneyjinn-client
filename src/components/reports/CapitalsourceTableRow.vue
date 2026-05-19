<template>
  <TableRow class="">
    <TableCell class="text-left border-r">
      {{ capitalsourceTypeString }}
    </TableCell>
    <TableCell class="text-left border-r">
      {{ capitalsourceStateString }}
    </TableCell>
    <TableCell class="text-left break-words whitespace-normal border-r">{{
      capitalsourceComment
    }}</TableCell>
    <TableCell class="text-right border-r"
      ><SpanAmount :amount="amountBeginOfMonthFixed"
    /></TableCell>
    <TableCell class="text-right border-r" v-if="currentMonthIsSettled">
      <SpanAmount :amount="amountEndOfMonthFixed" />
    </TableCell>
    <TableCell class="text-right border-r">
      <SpanAmount :amount="amountEndOfMonthCalculated" />
    </TableCell>
    <TableCell class="text-right" v-if="currentMonthIsSettled">
      <SpanAmount :amount="differenceFixedCalculated" />
    </TableCell>
    <TableCell class="text-right border-r" v-if="!currentMonthIsSettled">
      <SpanAmount :amount="amountCurrent" />
    </TableCell>
    <TableCell class="text-right" v-if="!currentMonthIsSettled">
      {{ amountCurrentStateString }}
    </TableCell>
  </TableRow>
</template>

<script lang="ts" setup>
import { TableCell, TableRow } from "@/components/ui/table";
import {
  CapitalsourceState,
  capitalsourceStateNames,
} from "@/model/capitalsource/CapitalsourceState";
import {
  CapitalsourceType,
  capitalsourceTypeNames,
} from "@/model/capitalsource/CapitalsourceType";
import { formatDateWithTime } from "@/tools/views/FormatDate";
import { computed, type PropType } from "vue";
import { useI18n } from "vue-i18n";
import SpanAmount from "../SpanAmount.vue";

const { t } = useI18n();

const props = defineProps({
  capitalsourceType: {
    type: Number as PropType<CapitalsourceType>,
    required: true,
  },
  capitalsourceState: {
    type: Number as PropType<CapitalsourceState>,
    required: true,
  },
  capitalsourceComment: {
    type: String,
    required: true,
  },
  amountBeginOfMonthFixed: {
    type: Number,
    required: true,
  },
  amountEndOfMonthFixed: {
    type: Number,
    required: false,
  },
  amountEndOfMonthCalculated: {
    type: Number,
    required: true,
  },
  amountCurrent: {
    type: Number,
    required: false,
  },
  amountCurrentState: {
    type: Date,
    required: false,
  },
  currentMonthIsSettled: {
    type: Boolean,
    required: true,
  },
});

const capitalsourceTypeString = computed(() => {
  return capitalsourceTypeNames[props.capitalsourceType];
});
const capitalsourceStateString = computed(() => {
  return capitalsourceStateNames[props.capitalsourceState];
});
const differenceFixedCalculated = computed(() => {
  return props.amountEndOfMonthFixed == null
    ? 0
    : props.amountEndOfMonthFixed - props.amountEndOfMonthCalculated;
});
const amountCurrentStateString = computed(() => {
  return props.amountCurrentState == null
    ? t("Reports.calculated")
    : formatDateWithTime(props.amountCurrentState);
});
</script>
