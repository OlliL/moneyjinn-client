<template>
  <tr>
    <td class="text-start">{{ mcp.name }}</td>
    <td class="text-start">{{ validFromString }}</td>
    <td class="text-start">{{ validTilString }}</td>
    <td class="text-start">{{ mcp.moneyflowComment }}</td>
    <td class="text-start">{{ mcp.postingAccountName }}</td>
    <td class="text-center">
      <span role="button" class="link-primary" @click="editContractpartner"
        >bearbeiten</span
      >
    </td>
    <td class="text-center">
      <span role="button" class="link-primary" @click="deleteContractpartner"
        >l&ouml;schen</span
      >
    </td>
    <td class="text-center">Konten</td>
  </tr>
</template>
<script lang="ts">
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import { formatDate } from "@/tools/views/FormatDate";
import { defineComponent, type PropType } from "vue";

// FIXME: Account handling

export default defineComponent({
  name: "ReportTableRow",
  props: {
    mcp: {
      type: Object as PropType<Contractpartner>,
      required: true,
    },
  },
  emits: ["deleteContractpartner", "editContractpartner"],
  computed: {
    validFromString(): string {
      return formatDate(this.mcp.validFrom);
    },
    validTilString(): string {
      return formatDate(this.mcp.validTil);
    },
  },
  methods: {
    deleteContractpartner() {
      this.$emit("deleteContractpartner", this.mcp);
    },
    editContractpartner() {
      this.$emit("editContractpartner", this.mcp);
    },
  },
});
</script>
