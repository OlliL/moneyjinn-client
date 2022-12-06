<template>
  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>Geldbewegung hinzuf&uuml;gen</h4>
      </div>
    </div>
    <div
      class="row justify-content-md-center mb-4"
      v-show="preDefMoneyflows.length > 0"
    >
      <div class="col-md-4 col-xs-12">
        <select
          class="form-select"
          id="selectmoneyflow"
          v-model="preDefMoneyflowId"
          @change="selectPreDefMoneyflow"
        >
          <option value="0">Neue Buchung</option>
          <option v-for="mcp of preDefMoneyflows" :key="mcp.id" :value="mcp.id">
            {{ mcp.contractpartnerName }} | {{ mcp.amount.toFixed(2) }} &euro; |
            {{ mcp.comment }}
          </option>
        </select>
      </div>
    </div>
    <div class="row justify-content-md-center">
      <div class="col-md-9 col-xs-12">
        <div class="card w-100 bg-light">
          <div class="card-body">
            <form @submit.prevent="createMoneyflow">
              <div class="container-fluid">
                <EditMoneyflowVue
                  :selected-pre-def-moneyflow="selectedPreDefMoneyflow"
                  ref="editMoneyflowVue"
                />
                <div class="row no-gutters flex-lg-nowrap">
                  <div class="col-12">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      @click="resetForm"
                    >
                      r&uuml;cksetzen
                    </button>
                    &nbsp;&nbsp;
                    <button type="submit" class="btn btn-primary">
                      Speichern
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
import PreDefMoneyflowControllerHandler from "@/handler/PreDefMoneyflowControllerHandler";
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import { defineComponent } from "vue";
import EditMoneyflowVue from "@/components/moneyflow/EditMoneyflowInternal.vue";
import { preDefMoneyflowAlreadyUsedThisMonth } from "@/model/moneyflow/PreDefMoneyflow";

type CreateMoneyflowData = {
  preDefMoneyflows: Array<PreDefMoneyflow>;
  preDefMoneyflowId: number;
  selectedPreDefMoneyflow: PreDefMoneyflow | undefined;
};
export default defineComponent({
  name: "CreateMoneyflow",
  data(): CreateMoneyflowData {
    return {
      preDefMoneyflows: new Array<PreDefMoneyflow>(),
      preDefMoneyflowId: 0,
      selectedPreDefMoneyflow: undefined,
    };
  },
  async mounted() {
    const allPreDefMoneyflows =
      await PreDefMoneyflowControllerHandler.fetchAllPreDefMoneyflow();

    // remove those PreDefMoneyflows which where used this month already and have onceMonth set
    const today = new Date();
    this.preDefMoneyflows = allPreDefMoneyflows.filter((mpm) => {
      return (
        !mpm.onceAMonth || !preDefMoneyflowAlreadyUsedThisMonth(today, mpm)
      );
    });
  },
  methods: {
    selectPreDefMoneyflow() {
      if (this.preDefMoneyflowId <= 0) {
        this.selectedPreDefMoneyflow = undefined;
      } else {
        const preDefMoneyflow = this.preDefMoneyflows.find((mpm) => {
          return mpm.id === +this.preDefMoneyflowId;
        });
        if (preDefMoneyflow) {
          this.selectedPreDefMoneyflow = preDefMoneyflow;
        }
      }
    },
    async createMoneyflow() {
      if (
        await (
          this.$refs.editMoneyflowVue as typeof EditMoneyflowVue
        ).createMoneyflow()
      ) {
        this.resetForm();
      }
    },
    resetForm() {
      this.preDefMoneyflowId = 0;
      this.selectPreDefMoneyflow();
      (this.$refs.editMoneyflowVue as typeof EditMoneyflowVue).resetForm();
    },
  },
  components: { EditMoneyflowVue },
});
</script>
