<template>
  <tr>
    <td class="text-start">{{ capitalsourceTypeString }}</td>
    <td class="text-start">{{ capitalsourceStateString }}</td>
    <td class="text-start">{{ capitalsourceComment }}</td>
    <td :class="amountBeginOfMonthFixedClass">
      {{ amountBeginOfMonthFixedString }} &euro;
    </td>
    <td :class="amountEndOfMonthFixedClass" v-if="currentMonthIsSettled">
      {{ amountEndOfMonthFixedString }} &euro;
    </td>
    <td :class="amountEndOfMonthCalculatedClass">
      {{ amountEndOfMonthCalculatedString }} &euro;
    </td>
    <td :class="differenceFixedCalculatedClass" v-if="currentMonthIsSettled">
      {{ differenceFixedCalculatedString }} &euro;
    </td>
    <td :class="amountCurrentClass" v-if="!currentMonthIsSettled">
      {{ amountCurrentString }} &euro;
    </td>
    <td class="text-end" v-if="!currentMonthIsSettled">
      {{ amountCurrentStateString }}
    </td>
  </tr>
</template>

<script lang="ts">
import {
  CapitalsourceType,
  capitalsourceTypeNames,
} from "@/model/capitalsource/CapitalsourceType";
import {
  CapitalsourceState,
  capitalsourceStateNames,
} from "@/model/capitalsource/CapitalsourceState";
import { redIfNegativeEnd, formatNumber } from "@/tools/views/FormatNumber";
import { defineComponent, type PropType } from "vue";
import { formatDateWithTime } from "@/tools/views/FormatDate";

export default defineComponent({
  name: "CapitalsourceTableRow",
  data() {
    return {};
  },
  props: {
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
  },
  computed: {
    capitalsourceTypeString(): string {
      return capitalsourceTypeNames[this.capitalsourceType];
    },
    capitalsourceStateString(): string {
      return capitalsourceStateNames[this.capitalsourceState];
    },
    amountBeginOfMonthFixedString(): string {
      return formatNumber(this.amountBeginOfMonthFixed, 2);
    },
    amountBeginOfMonthFixedClass(): string {
      return redIfNegativeEnd(this.amountBeginOfMonthFixed);
    },
    amountEndOfMonthFixedString(): string {
      return this.amountEndOfMonthFixed != null
        ? formatNumber(this.amountEndOfMonthFixed, 2)
        : "";
    },
    amountEndOfMonthFixedClass(): string {
      return redIfNegativeEnd(this.amountEndOfMonthFixed);
    },
    amountEndOfMonthCalculatedString(): string {
      return formatNumber(this.amountEndOfMonthCalculated, 2);
    },
    amountEndOfMonthCalculatedClass(): string {
      return redIfNegativeEnd(this.amountEndOfMonthCalculated);
    },
    differenceFixedCalculated(): number {
      return this.amountEndOfMonthFixed != null
        ? this.amountEndOfMonthFixed - this.amountEndOfMonthCalculated
        : 0;
    },
    differenceFixedCalculatedString(): string {
      return formatNumber(this.differenceFixedCalculated, 2);
    },
    differenceFixedCalculatedClass(): string {
      return redIfNegativeEnd(this.differenceFixedCalculated);
    },
    amountCurrentString(): string {
      return this.amountCurrent != null
        ? formatNumber(this.amountCurrent, 2)
        : "";
    },
    amountCurrentClass(): string {
      return redIfNegativeEnd(this.amountCurrent);
    },
    amountCurrentStateString(): string {
      return this.amountCurrentState != null
        ? formatDateWithTime(this.amountCurrentState)
        : "berechnet";
    },
  },
});
</script>
