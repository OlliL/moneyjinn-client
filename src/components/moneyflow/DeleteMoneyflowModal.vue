<template>
  <ModalVue title="Geldbewegung l&ouml;schen" ref="modalComponent">
    <template #body>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Buchungsdatum
        </div>
        <div class="text-start col-sm-9">
          <SpanDate :date="mmf.bookingDate" />
        </div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Rechnungsdatum
        </div>
        <div class="text-start col-sm-9">
          <SpanDate :date="mmf.invoiceDate" />
        </div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Vertragspartner
        </div>
        <div class="text-start col-sm-9">{{ mmf.contractpartnerName }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Kapitalquelle
        </div>
        <div class="text-start col-sm-9">{{ mmf.capitalsourceComment }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Betrag
        </div>
        <div class="text-start col-sm-9">
          <SpanAmount :amount="mmf.amount" />
        </div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Kommentar
        </div>
        <div class="text-start col-sm-9">{{ mmf.comment }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Buchungskonto
        </div>
        <div class="text-start col-sm-9">{{ mmf.postingAccountName }}</div>
      </div>
    </template>
    <template #footer>
      <button type="button" class="btn btn-danger" @click="deleteMoneyflow">
        L&ouml;schen
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts">
import MoneyflowControllerHandler from "@/handler/MoneyflowControllerHandler";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { defineComponent } from "vue";
import ModalVue from "../Modal.vue";
import SpanAmount from "../SpanAmount.vue";
import SpanDate from "../SpanDate.vue";

export default defineComponent({
  name: "DeleteMoneyflowModal",
  data() {
    return {
      mmf: {} as Moneyflow,
    };
  },
  methods: {
    async _show(mmf: Moneyflow) {
      this.mmf = mmf;
      (this.$refs.modalComponent as typeof ModalVue)._show();
    },
    async deleteMoneyflow() {
      await MoneyflowControllerHandler.deleteMoneyflow(this.mmf.id);
      (this.$refs.modalComponent as typeof ModalVue)._hide();
      this.$emit("moneyflowDeleted", this.mmf);
    },
  },
  expose: ["_show"],
  emits: ["moneyflowDeleted"],
  components: { ModalVue, SpanAmount, SpanDate },
});
</script>
