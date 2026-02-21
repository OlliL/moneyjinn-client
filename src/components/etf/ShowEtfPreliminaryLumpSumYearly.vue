<template>
  <table class="table table-bordered table-hover">
    <colgroup>
      <col style="width: 60%" />
      <col style="width: 40%" />
    </colgroup>
    <tbody>
      <tr>
        <th scope="row">{{ $t("ETFPreliminaryLumpSum.price") }}</th>
        <td class="text-end">
          <SpanAmount :amount="mep.amountDecember" :decimal-places="2" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { type PropType } from "vue";
import SpanAmount from "../SpanAmount.vue";
import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";

const props = defineProps({
  mep: {
    type: Object as PropType<EtfPreliminaryLumpSum>,
    required: true,
  },
});
</script>
