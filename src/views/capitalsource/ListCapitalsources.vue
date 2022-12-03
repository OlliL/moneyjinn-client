<template>
  <CreateCapitalsourceModalVue
    ref="createCapitalsourceModalList"
    id-suffix="List"
  />

  <div class="container-fluid text-center">
    <h4>Reports</h4>
    <div class="row justify-content-md-center mb-4" style="margin-top: 20px">
      <div class="col-md-9 col-xs-12">
        <form action="#">
          <table style="margin: 0 auto">
            <tr>
              <td class="text-right pe-2">
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="showCreateCapitalsourceModal"
                >
                  Neu
                </button>
              </td>
              <td>
                <nav aria-label="Start letter navigation" v-if="dataLoaded">
                  <ul class="pagination month-selection">
                    <li>
                      <a
                        :class="
                          $props.letter === ''
                            ? 'page-link active'
                            : 'page-link'
                        "
                        href="#"
                        @click="selectLetter('')"
                        >Alle</a
                      >
                    </li>
                    <li
                      class="page-item"
                      v-for="letter in letters"
                      :key="letter"
                    >
                      <a
                        :class="
                          $props.letter === letter
                            ? 'page-link active'
                            : 'page-link'
                        "
                        href="#"
                        @click="selectLetter(letter)"
                        >{{ letter }}</a
                      >
                    </li>
                  </ul>
                </nav>
              </td>
            </tr>
          </table>
        </form>
      </div>
    </div>
    <div class="row justify-content-md-center">
      <div class="col-md-9 col-xs-12">
        <table class="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th class="text-center">Kommentar</th>
              <th class="text-center">Typ</th>
              <th class="text-center">Status</th>
              <th class="text-center">IBAN</th>
              <th class="text-center">BIC</th>
              <th class="text-center">g&uuml;ltig ab</th>
              <th class="text-center">g&uuml;ltig bis</th>
              <th class="text-center">Gruppe</th>
              <th class="text-center">Datenimport</th>
              <th class="text-center" colspan="2"></th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useCapitalsourceStore } from "@/stores/CapitalsourceStore";
import router, { Routes } from "@/router";
import { defineComponent } from "vue";
import { mapActions } from "pinia";
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import CreateCapitalsourceModalVue from "@/components/capitalsource/CreateCapitalsourceModal.vue";
export default defineComponent({
  name: "ListCapitalsources",
  data() {
    return {
      dataLoaded: false,
      letters: {} as Array<string>,
      capitalsources: {} as Array<Capitalsource>,
    };
  },
  props: {
    letter: {
      type: String,
      default: "",
    },
  },
  async mounted() {
    this.letters = await this.getCapitalsourceLetters();
    this.loadData(this.$props.letter);
    this.dataLoaded = true;
  },
  methods: {
    ...mapActions(useCapitalsourceStore, ["getCapitalsourceLetters"]),
    ...mapActions(useCapitalsourceStore, ["getCapitalsourceForLetter"]),
    loadData(letter: string) {
      this.capitalsources = this.getCapitalsourceForLetter(letter);
      console.log(this.capitalsources);
    },
    selectLetter(letter: string) {
      router.push({
        name: Routes.listCapitalsources,
        params: { letter: letter },
      });
      this.loadData(letter);
    },
    showCreateCapitalsourceModal() {
      (
        this.$refs
          .createCapitalsourceModalList as typeof CreateCapitalsourceModalVue
      )._show();
    },
  },
  components: { CreateCapitalsourceModalVue },
});
</script>
