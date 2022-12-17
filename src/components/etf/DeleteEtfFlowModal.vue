<template>
  <ModalVue title="ETF Buchung l&ouml;schen" ref="modalComponent">
    <template #body>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          ETF
        </div>
        <div class="text-start col-sm-9">{{ etfName }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Buchungsdatum
        </div>
        <div class="text-start col-sm-9">{{ timestampString }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          St&uuml;ck
        </div>
        <div :class="'col-sm-9 ' + amountClass">{{ amountString }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Preis pro St&uuml;ck
        </div>
        <div :class="'col-sm-9 ' + priceClass">{{ priceString }} &euro;</div>
      </div>
    </template>
    <template #footer>
      <button type="button" class="btn btn-danger" @click="deleteEtfFlow">
        L&ouml;schen
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts">
import EtfFlowControllerHandler from "@/handler/EtfControllerHandler";
import type { EtfFlow } from "@/model/etf/EtfFlow";
import { formatDateWithTime } from "@/tools/views/FormatDate";
import { formatNumber, redIfNegativeStart } from "@/tools/views/FormatNumber";
import { defineComponent } from "vue";
import ModalVue from "../Modal.vue";

export default defineComponent({
  name: "DeleteEtfFlowModal",
  data() {
    return {
      etfFlow: {} as EtfFlow,
      etfName: "",
    };
  },
  computed: {
    amountClass() {
      return redIfNegativeStart(this.etfFlow.amount);
    },
    amountString() {
      return formatNumber(this.etfFlow.amount, 3);
    },
    priceClass() {
      return redIfNegativeStart(this.etfFlow.price);
    },
    priceString() {
      return formatNumber(this.etfFlow.price, 3);
    },
    timestampString() {
      return (
        formatDateWithTime(this.etfFlow.timestamp) +
        ":" +
        String(this.etfFlow.nanoseconds + 1000000000).substring(1, 4) //80000000 -> 1080000000 -> 080
      );
    },
  },
  methods: {
    async _show(etfFlow: EtfFlow, etfName: string) {
      this.etfFlow = etfFlow;
      this.etfName = etfName;
      (this.$refs.modalComponent as typeof ModalVue)._show();
    },
    async deleteEtfFlow() {
      await EtfFlowControllerHandler.deleteEtfFlow(this.etfFlow.etfflowid);
      (this.$refs.modalComponent as typeof ModalVue)._hide();
      this.$emit("etfFlowDeleted", this.etfFlow);
    },
  },
  expose: ["_show"],
  emits: ["etfFlowDeleted"],
  components: { ModalVue },
});
</script>
