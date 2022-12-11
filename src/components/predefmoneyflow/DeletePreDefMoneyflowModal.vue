<template>
  <ModalVue
    title="Vordefinierte Geldbewegung l&ouml;schen"
    ref="modalComponent"
  >
    <template #body>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Betrag
        </div>
        <div :class="'col-sm-9 ' + amountClass">{{ amountString }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Vertragspartner
        </div>
        <div class="text-start col-sm-9">{{ mpm.contractpartnerName }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Kommentar
        </div>
        <div class="text-start col-sm-9">{{ mpm.comment }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Buchungskonto
        </div>
        <div class="text-start col-sm-9">
          {{ mpm.postingAccountName }}&nbsp;
        </div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Kapitalquelle
        </div>
        <div class="text-start col-sm-9">
          {{ mpm.capitalsourceComment }}&nbsp;
        </div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          1x
        </div>
        <div class="text-start col-sm-9">{{ mpm.onceAMonth }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          angelegt am
        </div>
        <div class="text-start col-sm-9">{{ createDateString }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          verwendet am
        </div>
        <div class="text-start col-sm-9">{{ lastUsedString }}</div>
      </div>
    </template>
    <template #footer>
      <button
        type="button"
        class="btn btn-danger"
        @click="deletePreDefMoneyflow"
      >
        L&ouml;schen
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts">
import PreDefMoneyflowControllerHandler from "@/handler/PreDefMoneyflowControllerHandler";
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import { formatDate } from "@/tools/views/FormatDate";
import { formatNumber, redIfNegativeStart } from "@/tools/views/FormatNumber";
import { defineComponent } from "vue";
import ModalVue from "../Modal.vue";

export default defineComponent({
  name: "DeletePreDefMoneyflowModal",
  data() {
    return {
      mpm: {} as PreDefMoneyflow,
    };
  },
  computed: {
    createDateString(): string {
      return this.mpm.createDate ? formatDate(this.mpm.createDate) : "";
    },
    lastUsedString(): string {
      return this.mpm.lastUsed ? formatDate(this.mpm.lastUsed) : "";
    },
    onceAMonthColor(): string {
      return this.mpm.onceAMonth ? "green" : "red";
    },
    onceAMonthString(): string {
      return this.mpm.onceAMonth ? "Ja" : "Nein";
    },
    amountClass(): string {
      return redIfNegativeStart(this.mpm.amount);
    },
    amountString(): string {
      return formatNumber(this.mpm.amount, 2);
    },
  },
  methods: {
    async _show(mpm: PreDefMoneyflow) {
      this.mpm = mpm;
      (this.$refs.modalComponent as typeof ModalVue)._show();
    },
    async deletePreDefMoneyflow() {
      await PreDefMoneyflowControllerHandler.deletePreDefMoneyflow(this.mpm.id);
      (this.$refs.modalComponent as typeof ModalVue)._hide();
      this.$emit("preDefMoneyflowDeleted", this.mpm);
    },
  },
  expose: ["_show"],
  emits: ["preDefMoneyflowDeleted"],
  components: { ModalVue },
});
</script>
