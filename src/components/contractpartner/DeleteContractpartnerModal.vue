<template>
  <ModalVue title="Kapitalquelle l&ouml;schen" ref="modalComponent">
    <template #body>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Name
        </div>
        <div class="text-start col-sm-9">{{ mcp.name }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Stra&szlig;e
        </div>
        <div class="text-start col-sm-9">{{ mcp.street }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Postleitzahl
        </div>
        <div class="text-start col-sm-9">{{ mcp.postcode }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Stadt
        </div>
        <div class="text-start col-sm-9">{{ mcp.town }}&nbsp;</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Land
        </div>
        <div class="text-start col-sm-9">{{ mcp.country }}&nbsp;</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          g&uuml;ltig ab
        </div>
        <div class="text-start col-sm-9">{{ validFromString }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          g&uuml;ltig bis
        </div>
        <div class="text-start col-sm-9">{{ validTilString }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Standard Kommentar
        </div>
        <div class="text-start col-sm-9">{{ mcp.moneyflowComment }}&nbsp;</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Standard Buchungskonto
        </div>
        <div class="text-start col-sm-9">
          {{ mcp.postingAccountName }}&nbsp;
        </div>
      </div>
    </template>
    <template #footer>
      <button
        type="button"
        class="btn btn-danger"
        @click="deleteContractpartner"
      >
        L&ouml;schen
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts">
import ContractpartnerControllerHandler from "@/handler/ContractpartnerControllerHandler";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import { useContractpartnerStore } from "@/stores/ContractpartnerStore";
import { formatDate } from "@/tools/views/FormatDate";
import { defineComponent } from "vue";
import ModalVue from "../Modal.vue";

export default defineComponent({
  name: "DeleteContractpartnerModal",
  data() {
    return {
      mcp: {} as Contractpartner,
    };
  },
  computed: {
    validFromString(): string {
      return formatDate(this.mcp.validFrom);
    },
    validTilString(): string {
      return formatDate(this.mcp.validTil);
    },
  },
  methods: {
    async _show(mcp: Contractpartner) {
      this.mcp = mcp;
      (this.$refs.modalComponent as typeof ModalVue)._show();
    },
    deleteContractpartner() {
      ContractpartnerControllerHandler.deleteContractpartner(this.mcp.id);
      const contractpartnerStore = useContractpartnerStore();
      contractpartnerStore.deleteContractpartner(this.mcp);
      (this.$refs.modalComponent as typeof ModalVue)._hide();
      this.$emit("contractpartnerDeleted", this.mcp);
    },
  },
  expose: ["_show"],
  emits: ["contractpartnerDeleted"],
  components: { ModalVue },
});
</script>
