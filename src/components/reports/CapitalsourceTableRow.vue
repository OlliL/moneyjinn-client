<template>
  <tr>
    <td class="text-start">{{ capitalsourceTypeString }}</td>
    <td class="text-start">{{ capitalsourceStateString }}</td>
    <td class="text-start">{{ capitalsourceComment }}</td>
    <td class="text-end"><SpanAmount :amount="amountBeginOfMonthFixed" /></td>
    <td class="text-end" v-if="currentMonthIsSettled">
      <SpanAmount :amount="amountEndOfMonthFixed" />
    </td>
    <td class="text-end">
      <SpanAmount :amount="amountEndOfMonthCalculated" />
    </td>
    <td class="text-end" v-if="currentMonthIsSettled">
      <SpanAmount :amount="differenceFixedCalculated" />
    </td>
    <td class="text-end" v-if="!currentMonthIsSettled">
      <SpanAmount :amount="amountCurrent" />
    </td>
    <td class="text-end" v-if="!currentMonthIsSettled">
      {{ amountCurrentStateString }}
    </td>
  </tr>
</template>

<script lang="ts" setup>
import { computed, type PropType } from "vue";
import { useI18n } from "vue-i18n";

import SpanAmount from "../SpanAmount.vue";

import { formatDateWithTime } from "@/tools/views/FormatDate";

import {
  CapitalsourceType,
  capitalsourceTypeNames,
} from "@/model/capitalsource/CapitalsourceType";
import {
  CapitalsourceState,
  capitalsourceStateNames,
} from "@/model/capitalsource/CapitalsourceState";

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
  return props.amountEndOfMonthFixed != null
    ? props.amountEndOfMonthFixed - props.amountEndOfMonthCalculated
    : 0;
});
const amountCurrentStateString = computed(() => {
  return props.amountCurrentState != null
    ? formatDateWithTime(props.amountCurrentState)
    : t("Reports.calculated");
});
</script>
