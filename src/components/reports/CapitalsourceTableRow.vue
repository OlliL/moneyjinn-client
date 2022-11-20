<template>
  <tr>
    <td class="text-start">{{ capitalsourceTypeString }}</td>
    <td class="text-start">{{ capitalsourceStateString }}</td>
    <td class="text-start">{{ capitalsourceComment }}</td>
    <td :class="amountBeginOfMonthFixedClass">
      {{ amountBeginOfMonthFixedString }} &euro;
    </td>
    <td :class="amountEndOfMonthFixedClass">
      {{ amountEndOfMonthFixedString }} &euro;
    </td>
    <td :class="amountEndOfMonthCalculatedClass">
      {{ amountEndOfMonthCalculatedString }} &euro;
    </td>
    <td :class="differenceFixedCalculatedClass">
      {{ differenceFixedCalculatedString }} &euro;
    </td>
  </tr>
</template>

<script lang="ts">
import { capitalsourceTypeNames } from "@/model/capitalsource/CapitalsourceType";
import { capitalsourceStateNames } from "@/model/capitalsource/CapitalsourceState";
import { redIfNegativeEnd, formatNumber } from "@/tools/views/FormatNumber";
import { defineComponent } from "vue";

export default defineComponent({
  name: "CapitalsourceTableRow",
  data() {
    return {};
  },
  props: {
    capitalsourceType: {
      type: Number,
      required: true,
    },
    capitalsourceState: {
      type: Number,
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
      required: true,
    },
    amountEndOfMonthCalculated: {
      type: Number,
      required: true,
    },
    amountCurrent: {
      type: Number,
      required: true,
    },
    amountCurrentState: {
      type: String,
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
      return formatNumber(this.amountEndOfMonthFixed, 2);
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
      return this.amountEndOfMonthFixed - this.amountEndOfMonthCalculated;
    },
    differenceFixedCalculatedString(): string {
      return formatNumber(this.differenceFixedCalculated, 2);
    },
    differenceFixedCalculatedClass(): string {
      return redIfNegativeEnd(this.differenceFixedCalculated);
    },
  },
});
</script>
