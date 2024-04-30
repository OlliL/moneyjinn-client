<template>
  <tr>
    <td class="text-start">
      <a :href="etf.chartUrl">{{ etf.name }}</a>
    </td>
    <td class="text-start">{{ etf.isin }}</td>
    <td class="text-start">{{ etf.wkn }}</td>
    <td class="text-start">{{ etf.ticker }}</td>
    <td class="text-center">
      <span role="button" class="link-primary" @click="editEtf">{{
        $t("General.edit")
      }}</span>
    </td>
    <td class="text-center">
      <span role="button" class="link-primary" @click="deleteEtf">{{
        $t("General.delete")
      }}</span>
    </td>
  </tr>
</template>
<script lang="ts" setup>
import type { PropType } from "vue";

import type { Etf } from "@/model/etf/Etf";

const props = defineProps({
  etf: {
    type: Object as PropType<Etf>,
    required: true,
  },
});
const emit = defineEmits(["deleteEtf", "editEtf"]);

const deleteEtf = () => {
  emit("deleteEtf", props.etf);
};
const editEtf = () => {
  emit("editEtf", props.etf);
};
</script>
