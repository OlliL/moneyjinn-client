<template>
  <div class="row justify-content-md-center mb-4">
    <div class="col-md-9 col-xs-12">
      <div class="card w-100 bg-light">
        <div class="card-body">
          <div class="row">
            <div
              style="overflow-x: scroll; white-space: nowrap; height: 400px"
              class="col-md-3 col-xs-12"
            >
              <img
                v-if="isJpeg"
                :src="`data:image/png;base64,${receipt.receipt}`"
                style="max-width: 100%"
              />
              <object
                style="height: 75vh; width: 100%"
                v-if="isPdf"
                id="pdf"
                :data="`data:application/pdf;base64,${receipt.receipt}`"
                type="application/pdf"
              ></object>
            </div>
            <div class="col-md-9 col-xs-12">
              <form @submit.prevent="searchMoneyflows">
                <div
                  class="row no-gutters flex-lg-nowrap mb-4 justify-content-center"
                >
                  <div
                    class="col-md-1 col-xs-6 d-flex align-items-center justify-content-end"
                  >
                    <button type="submit" class="btn btn-primary">
                      <i class="bi bi-search"></i>
                    </button>
                  </div>
                  <div class="col-md-3 col-xs-12">
                    <div class="input-group">
                      <div class="form-floating">
                        <input
                          v-model="amount"
                          id="receiptAmount"
                          type="number"
                          step="0.01"
                          class="form-control text-end"
                        />
                        <label for="receiptAmount">Betrag</label>
                      </div>
                      <span class="input-group-text"
                        ><i class="bi bi-currency-euro"></i
                      ></span>
                    </div>
                  </div>
                  <div class="col-md-3 col-xs-12">
                    <div class="input-group">
                      <div class="form-floating">
                        <input
                          v-model="startDate"
                          id="receiptStartDate"
                          type="date"
                          class="form-control"
                        />
                        <label for="receiptStartDate">Startdatum</label>
                      </div>
                      <span class="input-group-text"
                        ><i class="bi bi-calendar-date"></i
                      ></span>
                    </div>
                  </div>
                  <div class="col-md-3 col-xs-12">
                    <div class="input-group">
                      <div class="form-floating">
                        <input
                          v-model="endDate"
                          id="receiptEndDate"
                          type="date"
                          class="form-control"
                        />
                        <label for="receiptEndDate">Enddatum</label>
                      </div>
                      <span class="input-group-text"
                        ><i class="bi bi-calendar-date"></i
                      ></span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import MoneyflowControllerHandler from "@/handler/MoneyflowControllerHandler";
import type { ImportedMoneyflowReceipt } from "@/model/moneyflow/ImportedMoneyflowReceipt";
import { toFixed } from "@/tools/math";
import { getISOStringDate } from "@/tools/views/FormatDate";
import { defineComponent, type PropType } from "vue";

//FIXME: show search-result Data
//FIXME: auto-display search results if filename is a number
//FIXME: import button
//FIXME: delete button
//FIXME: form validation (all 3 input fields must be set)
//FIXME: error handling

export default defineComponent({
  name: "ImportReceiptsRow",
  data() {
    return {
      startDate: "",
      endDate: "",
      amount: 0,
    };
  },
  mounted() {
    const posOfDot = this.receipt.filename.indexOf(".");
    const amountFromFilename = this.receipt.filename.substring(0, posOfDot);
    if (!isNaN(Number(amountFromFilename))) {
      this.amount = toFixed(+amountFromFilename / 100, 2);
    }
    const today = new Date();
    const todayMinus30 = new Date();
    todayMinus30.setDate(todayMinus30.getDate() - 30);

    this.startDate = getISOStringDate(todayMinus30);
    this.endDate = getISOStringDate(today);
  },
  props: {
    receipt: {
      type: Object as PropType<ImportedMoneyflowReceipt>,
      required: true,
    },
  },
  computed: {
    isJpeg() {
      return this.receipt.mediaType === "image/jpeg";
    },
    isPdf() {
      return this.receipt.mediaType === "application/pdf";
    },
  },
  methods: {
    async searchMoneyflows() {
      const moneyflows = MoneyflowControllerHandler.searchMoneyflowsByAmount(
        this.amount,
        new Date(this.startDate),
        new Date(this.endDate)
      );
      console.log(await moneyflows);
    },
  },
  components: {},
});
</script>
