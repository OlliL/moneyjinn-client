<template>
  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>Importierte Geldbewegungen</h4>
      </div>
    </div>

    <div
      class="row justify-content-md-center mb-5"
      v-for="importedMoneyflow in importMoneyflows"
      :key="importedMoneyflow.externalid"
    >
      <div class="col-md-9 col-xs-12">
        <div class="card w-100 bg-light">
          <div class="card-body">
            <form @submit.prevent="importImportedMoneyflow(importedMoneyflow)">
              <div class="container-fluid">
                <div class="row mb-2">
                  <div
                    class="col-md-1 col-xs-6 d-flex justify-content-end align-items-center"
                    style="font-weight: 700; font-size: 10.5px"
                  >
                    IBAN:
                  </div>
                  <div class="col-md-2 col-xs-6 text-start">
                    {{ importedMoneyflow.accountNumber }}
                  </div>
                  <div
                    class="col-md-1 col-xs-6 d-flex justify-content-end align-items-center"
                    style="font-weight: 700; font-size: 10.5px"
                  >
                    BIC:
                  </div>
                  <div class="col-md-2 col-xs-6 text-start">
                    {{ importedMoneyflow.bankCode }}
                  </div>
                  <div
                    class="col-md-2 col-xs-6 d-flex justify-content-end align-items-center"
                    style="font-weight: 700; font-size: 10.5px"
                  >
                    Transaktionspartner:
                  </div>
                  <div class="col-md-4 col-xs-6 text-start">
                    {{ importedMoneyflow.name }}
                  </div>
                </div>
                <div class="row mb-3">
                  <div
                    class="col-md-1 col-xs-6 d-flex justify-content-end align-items-center"
                    style="font-weight: 700; font-size: 10.5px"
                  >
                    Verwendungszweck:
                  </div>
                  <div class="col-md-11 col-xs-6 text-start">
                    {{ importedMoneyflow.usage }}
                  </div>
                </div>
                <EditMoneyflowVue
                  :ref="'editMoneyflowVue' + importedMoneyflow.id"
                  :mmf-to-edit="importedMoneyflow"
                  :id-suffix="importedMoneyflow.id + ''"
                />
                <div class="row no-gutters flex-lg-nowrap">
                  <div class="col-12">
                    <button type="submit" class="btn btn-primary mx-2">
                      &Uuml;bernehmen
                    </button>
                    <button
                      type="button"
                      class="btn btn-danger mx-2"
                      @click="deleteImportedMoneyflow(importedMoneyflow)"
                    >
                      l&ouml;schen
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import type { ImportedMoneyflow } from "@/model/moneyflow/ImportedMoneyflow";
import ImportedMoneyflowControllerHandler from "@/handler/ImportedMoneyflowControllerHandler";
import EditMoneyflowVue from "@/components/moneyflow/EditMoneyflowInternal.vue";

export default defineComponent({
  name: "ImportMoneyflows",
  data() {
    return {
      importMoneyflows: {} as Array<ImportedMoneyflow>,
    };
  },
  async mounted() {
    this.importMoneyflows =
      await ImportedMoneyflowControllerHandler.showAddImportedMoneyflows();
  },
  methods: {
    async deleteImportedMoneyflow(mim: ImportedMoneyflow) {
      const ref = (
        this.$refs["editMoneyflowVue" + mim.id] as typeof EditMoneyflowVue
      )[0];
      await ref.deleteImportedMoneyflow(mim.id);
      this.importMoneyflows = this.importMoneyflows.filter(
        (entry) => entry.id !== mim.id
      );
    },
    async importImportedMoneyflow(mim: ImportedMoneyflow) {
      const ref = (
        this.$refs["editMoneyflowVue" + mim.id] as typeof EditMoneyflowVue
      )[0];
      if (await ref.importImportedMoneyflow(mim)) {
        this.importMoneyflows = this.importMoneyflows.filter(
          (entry) => entry.id !== mim.id
        );
      }
    },
  },
  components: { EditMoneyflowVue },
});
</script>
