<template>
  <div class="row justify-content-md-center py-4">
    <div class="col col-lg-8">
      <div class="card">
        <div class="card-header text-center p-3">
          <h4>{{ groupName }}</h4>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-xs-12 text-center">
              <table
                class="table table-striped table-bordered table-hover"
                style="table-layout: fixed"
              >
                <col style="width: 15%" />
                <col style="width: 10%" />
                <col style="width: 20%" />
                <col style="width: 10%" />
                <col style="width: 10%" />
                <col style="width: 10%" />
                <col style="width: 15%" />
                <thead>
                  <tr>
                    <th class="text-center">Typ</th>
                    <th class="text-center">Status</th>
                    <th class="text-center">Kommentar</th>
                    <th class="text-center">Anfangsbetrag</th>
                    <th class="text-center">Endbetrag (fix)</th>
                    <th class="text-center">Endbetrag (errechnet)</th>
                    <!--FIXME: calculated data without settlement-->
                    <!--<th class="text-center">Aktueller Betrag</th>-->
                    <!--<th class="text-center">Stand</th>-->
                    <th class="text-center">Differenz</th>
                  </tr>
                </thead>

                <tbody>
                  <CapitalsourceTableRowVue
                    v-for="data in capitalsourceData"
                    :key="data.capitalsourceComment"
                    v-bind="data"
                  />
                  <!--FIXME: sum row-->
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { ReportTurnoverCapitalsource } from "@/model/report/ReportTurnoverCapitalsourceTransport";
import { defineComponent } from "vue";
import CapitalsourceTableRowVue from "./CapitalsourceTableRow.vue";
export default defineComponent({
  name: "CapitalsourceTable",
  props: {
    capitalsourceData: {
      type: Array<ReportTurnoverCapitalsource>,
      required: true,
    },
    groupName: {
      type: String,
      required: true,
    },
  },
  computed: {},
  components: { CapitalsourceTableRowVue },
});
</script>
