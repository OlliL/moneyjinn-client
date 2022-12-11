<template>
  <CreateCapitalsourceModalVue
    ref="createCapitalsourceModalList"
    id-suffix="List"
    @capitalsource-created="capitalsourceCreated"
  />
  <DeleteCapitalsourceModalVue
    ref="deleteModal"
    @capitalsource-deleted="capitalsourceDeleted"
  />

  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>Kapitalquellen</h4>
      </div>
    </div>
    <div class="row justify-content-md-center mb-4">
      <div class="col-md-9 col-xs-12">
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
                  <li class="page-item">
                    <a
                      :class="
                        $props.letter === '' ? 'page-link active' : 'page-link'
                      "
                      href="#"
                      @click="selectLetter('')"
                      >Alle</a
                    >
                  </li>
                  <li class="page-item" v-for="letter in letters" :key="letter">
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
      </div>
    </div>
    <div class="row justify-content-md-center mb-4">
      <div class="col-md-auto">
        <form action="#">
          <div class="form-check form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              id="capitalsourcesValid"
              v-model="validNow"
              @change="reloadView"
            />
            <label class="form-check-label" for="capitalsourcesValid"
              >Jetzt g&uuml;ltig</label
            >
          </div>
        </form>
      </div>
    </div>
    <div class="row justify-content-md-center">
      <div class="col-md-9 col-xs-12">
        <table class="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>Kommentar</th>
              <th>Typ</th>
              <th>Status</th>
              <th>IBAN</th>
              <th>BIC</th>
              <th>g&uuml;ltig ab</th>
              <th>g&uuml;ltig bis</th>
              <th>Gruppe</th>
              <th>Datenimport</th>
              <th colspan="2"></th>
            </tr>
          </thead>
          <tbody>
            <ListCapitalsourceRowVue
              v-for="mcs in capitalsources"
              :key="mcs.id"
              :mcs="mcs"
              :owner="mcs.userId === getUserId"
              @delete-capitalsource="deleteCapitalsource"
              @edit-capitalsource="editCapitalsource"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useCapitalsourceStore } from "@/stores/CapitalsourceStore";
import router, { Routes } from "@/router";
import { defineComponent } from "vue";
import { mapActions, mapState } from "pinia";
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import CreateCapitalsourceModalVue from "@/components/capitalsource/CreateCapitalsourceModal.vue";
import ListCapitalsourceRowVue from "@/components/capitalsource/ListCapitalsourceRow.vue";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import DeleteCapitalsourceModalVue from "@/components/capitalsource/DeleteCapitalsourceModal.vue";
export default defineComponent({
  name: "ListCapitalsources",
  data() {
    return {
      dataLoaded: false,
      validNow: false,
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
    this.loadData(this.$props.letter);
    this.dataLoaded = true;
  },
  computed: {
    ...mapState(useUserSessionStore, ["getUserId"]),
  },
  methods: {
    ...mapActions(useCapitalsourceStore, ["getCapitalsourceLetters"]),
    ...mapActions(useCapitalsourceStore, ["getCapitalsourceForLetter"]),
    reloadView() {
      this.loadData(this.$props.letter);
    },
    async loadData(letter: string) {
      this.letters = await this.getCapitalsourceLetters(this.validNow);
      this.capitalsources = this.getCapitalsourceForLetter(
        letter,
        this.validNow
      );
      if (this.capitalsources.length === 0) this.selectLetter("");
    },
    selectLetter(letter: string) {
      router.push({
        name: Routes.ListCapitalsources,
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
    capitalsourceCreated() {
      this.reloadView();
    },
    deleteCapitalsource(mcs: Capitalsource) {
      (this.$refs.deleteModal as typeof DeleteCapitalsourceModalVue)._show(mcs);
    },
    editCapitalsource(mcs: Capitalsource) {
      (
        this.$refs
          .createCapitalsourceModalList as typeof CreateCapitalsourceModalVue
      )._show(mcs);
    },
    capitalsourceDeleted() {
      this.reloadView();
    },
  },
  components: {
    CreateCapitalsourceModalVue,
    ListCapitalsourceRowVue,
    DeleteCapitalsourceModalVue,
  },
});
</script>
