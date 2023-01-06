<template>
  <ModalVue title="Kapitalquelle l&ouml;schen" ref="modalComponent">
    <template #body>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Kommentar
        </div>
        <div class="text-start col-sm-9">{{ mcs.comment }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Typ
        </div>
        <div class="text-start col-sm-9">{{ typeString }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Status
        </div>
        <div class="text-start col-sm-9">{{ stateString }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          IBAN
        </div>
        <div class="text-start col-sm-9">{{ mcs.accountNumber }}&nbsp;</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          BIC
        </div>
        <div class="text-start col-sm-9">{{ mcs.bankCode }}&nbsp;</div>
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
          Gruppe
        </div>
        <div class="text-start col-sm-9">
          <b :style="'color:' + groupUseColor">{{ groupUseString }}</b>
        </div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Datenimport
        </div>
        <div class="text-start col-sm-9">
          <b :style="'color:' + importAllowedColor">{{
            importAllowedString
          }}</b>
        </div>
      </div>
    </template>
    <template #footer>
      <button type="button" class="btn btn-danger" @click="deleteCapitalsource">
        L&ouml;schen
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts">
import CapitalsourceControllerHandler from "@/handler/CapitalsourceControllerHandler";
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import { capitalsourceImportNames } from "@/model/capitalsource/CapitalsourceImport";
import { capitalsourceStateNames } from "@/model/capitalsource/CapitalsourceState";
import { capitalsourceTypeNames } from "@/model/capitalsource/CapitalsourceType";
import { formatDate } from "@/tools/views/FormatDate";
import { defineComponent } from "vue";
import ModalVue from "../Modal.vue";

export default defineComponent({
  name: "DeleteCapitalsourceModal",
  data() {
    return {
      mcs: {} as Capitalsource,
    };
  },
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
    async _show(mcs: Capitalsource) {
      this.mcs = mcs;
      (this.$refs.modalComponent as typeof ModalVue)._show();
    },
    async deleteCapitalsource() {
      await CapitalsourceControllerHandler.deleteCapitalsource(this.mcs.id);
      (this.$refs.modalComponent as typeof ModalVue)._hide();
      this.$emit("capitalsourceDeleted", this.mcs);
    },
  },
  expose: ["_show"],
  emits: ["capitalsourceDeleted"],
  components: { ModalVue },
});
</script>
