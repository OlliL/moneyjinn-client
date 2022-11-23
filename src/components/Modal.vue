<template>
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby=""
    aria-hidden="true"
    ref="modalEle"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">{{ title }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <slot name="body" />
          <img
            :src="`data:image/png;base64,${imageBase64}`"
            style="max-width: 100%; max-height: 100%"
          />
        </div>
        <div class="modal-footer">
          <slot name="footer"></slot>
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Modal } from "bootstrap";
import MoneyflowReceiptControllerHandler from "@/handler/MoneyflowReceiptControllerHandler";

export default defineComponent({
  name: "ReportTable",

  data() {
    return {
      thisModalObj: {} as Modal,
      imageBase64: "",
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
      let response = await MoneyflowReceiptControllerHandler.fetchReceipt(
        27753
      );
      console.log(response);
      this.imageBase64 = response;
      this.thisModalObj.show();
    },
  },
  expose: ["_show"],

  mounted() {
    this.thisModalObj = new Modal(this.$refs.modalEle as HTMLDivElement);
  },
});
</script>
