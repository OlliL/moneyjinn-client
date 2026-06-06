<template>
  <TableRow>
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
import SpanAmount from "@/components/common/SpanAmount.vue";
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
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  capitalsourceType: CapitalsourceType;
  capitalsourceState: CapitalsourceState;
  capitalsourceComment: string;
  amountBeginOfMonthFixed: number;
  amountEndOfMonthFixed?: number;
  amountEndOfMonthCalculated: number;
  amountCurrent?: number;
  amountCurrentState?: Date;
  currentMonthIsSettled: boolean;
}>();

const capitalsourceTypeString = computed(
  () => capitalsourceTypeNames[props.capitalsourceType],
);
const capitalsourceStateString = computed(
  () => capitalsourceStateNames[props.capitalsourceState],
);
const differenceFixedCalculated = computed(() =>
  props.amountEndOfMonthFixed == null
    ? 0
    : props.amountEndOfMonthFixed - props.amountEndOfMonthCalculated,
);
const amountCurrentStateString = computed(() =>
  props.amountCurrentState == null
    ? t("Reports.calculated")
    : formatDateWithTime(props.amountCurrentState),
);
</script>
