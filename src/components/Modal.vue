<template>
  <div
    class="modal fade"
    tabindex="-1"
    aria-labelledby=""
    aria-hidden="true"
    ref="modalEle"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header text-center">
          <h5 class="modal-title w-100">{{ title }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <slot name="body" />
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Abbrechen
          </button>
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Modal } from "bootstrap";

export default defineComponent({
  name: "ReportTable",

  data() {
    return {
      thisModalObj: {} as Modal,
    };
  },
  props: {
    title: {
      type: String,
      default: "",
    },
  },
  methods: {
    async _show() {
      this.thisModalObj.show();
    },
  },
  expose: ["_show"],

  mounted() {
    this.thisModalObj = new Modal(this.$refs.modalEle as HTMLDivElement);
  },
});
</script>
