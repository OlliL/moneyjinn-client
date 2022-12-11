<template>
  <tr>
    <td class="text-start">{{ mcs.comment }}</td>
    <td class="text-start">{{ typeString }}</td>
    <td class="text-start">{{ stateString }}</td>
    <td class="text-start">{{ mcs.accountNumber }}</td>
    <td class="text-start">{{ mcs.bankCode }}</td>
    <td class="text-start">{{ validFromString }}</td>
    <td class="text-start">{{ validTilString }}</td>
    <td class="text-center">
      <b :style="'color:' + groupUseColor">{{ groupUseString }}</b>
    </td>
    <td class="text-center">
      <b :style="'color:' + importAllowedColor">{{ importAllowedString }}</b>
    </td>
    <td class="text-center" v-if="owner">
      <span role="button" class="link-primary" @click="editCapitalsource"
        >bearbeiten</span
      >
    </td>
    <td class="text-center" v-if="owner">
      <span role="button" class="link-primary" @click="deleteCapitalsource"
        >l&ouml;schen</span
      >
    </td>
  </tr>
</template>
<script lang="ts">
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import { capitalsourceImportNames } from "@/model/capitalsource/CapitalsourceImport";
import { capitalsourceStateNames } from "@/model/capitalsource/CapitalsourceState";
import { capitalsourceTypeNames } from "@/model/capitalsource/CapitalsourceType";
import { formatDate } from "@/tools/views/FormatDate";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  name: "ListCapitalsourceRow",
  props: {
    mcs: {
      type: Object as PropType<Capitalsource>,
      required: true,
    },
    owner: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["deleteCapitalsource", "editCapitalsource"],
  computed: {
    groupUseColor(): string {
      return this.mcs.groupUse ? "green" : "red";
    },
    groupUseString(): string {
      return this.mcs.groupUse ? "Ja" : "Nein";
    },
    importAllowedColor(): string {
      return this.mcs.importAllowed > 0 ? "green" : "red";
    },
    importAllowedString(): string {
      return capitalsourceImportNames[this.mcs.importAllowed];
    },
    typeString(): string {
      return capitalsourceTypeNames[this.mcs.type];
    },
    stateString(): string {
      return capitalsourceStateNames[this.mcs.state];
    },
    validFromString(): string {
      return formatDate(this.mcs.validFrom);
    },
    validTilString(): string {
      return formatDate(this.mcs.validTil);
    },
  },
  methods: {
    deleteCapitalsource() {
      this.$emit("deleteCapitalsource", this.mcs);
    },
    editCapitalsource() {
      this.$emit("editCapitalsource", this.mcs);
    },
  },
});
</script>
