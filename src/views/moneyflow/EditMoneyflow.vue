<template>
  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>Geldbewegung hinzuf&uuml;gen</h4>
      </div>
    </div>
    <div class="row justify-content-md-center mb-4">
      <div class="col-md-4 col-xs-12">
        <select class="form-select form-control" id="selectmoneyflow">
          <option value="-1">Neue Buchung</option>
        </select>
      </div>
    </div>
    <div class="row justify-content-md-center">
      <div class="col-md-9 col-xs-12">
        <form
          @submit.prevent="saveMoneyflow"
          class="d-flex flex-row align-items-center flex-wrap"
        >
          <div class="card w-100 bg-light">
            <div class="card-body">
              <div class="alert alert-danger" v-if="serverError">
                {{ serverError }}
              </div>

              <div class="container-fluid">
                <div class="row no-gutters flex-lg-nowrap mb-4">
                  <div class="col-md-2 col-xs-12">
                    <div class="input-group">
                      <div class="form-floating">
                        <input
                          v-model="bookingdate"
                          id="bookingdate"
                          type="date"
                          @change="validateBookingdate"
                          :class="
                            ' form-control ' + bookingdateErrorData.inputClass
                          "
                        />
                        <label
                          for="bookingdate"
                          :style="'color: ' + bookingdateErrorData.fieldColor"
                          >{{ bookingdateErrorData.fieldLabel }}</label
                        >
                      </div>
                      <span class="input-group-text"
                        ><i class="bi bi-calendar-date"></i
                      ></span>
                    </div>
                  </div>
                  <div class="col-md-2 col-xs-12">
                    <div class="input-group">
                      <div class="form-floating">
                        <input
                          v-model="invoicedate"
                          id="invoicedate"
                          type="date"
                          @change="validateInvoicedate"
                          :class="
                            'form-control ' + invoicedateErrorData.inputClass
                          "
                        />
                        <label
                          for="invoicedate"
                          :style="'color: ' + invoicedateErrorData.fieldColor"
                          >{{ invoicedateErrorData.fieldLabel }}</label
                        >
                      </div>
                      <span class="input-group-text"
                        ><i class="bi bi-calendar-date"></i
                      ></span>
                    </div>
                  </div>
                  <div class="col-md-4 col-xs-12">
                    <ContractpartnerSelectVue
                      :field-color="contractpartnerErrorData.fieldColor"
                      :field-label="contractpartnerErrorData.fieldLabel"
                      :input-class="contractpartnerErrorData.inputClass"
                      :validity-date="validityDate"
                      :selected-id="mmf.contractpartnerid"
                      @contractpartner-selected="onContractpartnerSelected"
                    />
                  </div>

                  <div class="col-md-4 col-xs-12">
                    <div class="input-group">
                      <div class="form-floating">
                        <select
                          v-model="mmf.capitalsourceid"
                          id="capitalsource"
                          @change="validateCapitalsource"
                          :class="
                            'form-select form-control ' +
                            capitalsourceErrorData.inputClass
                          "
                        >
                          <option value="">&nbsp;</option>
                        </select>

                        <label
                          for="contractpartner"
                          :style="'color: ' + capitalsourceErrorData.fieldColor"
                          >{{ capitalsourceErrorData.fieldLabel }}</label
                        >
                      </div>
                      <span class="input-group-text"
                        ><i class="bi bi-plus"></i
                      ></span>
                    </div>
                  </div>
                </div>

                <div class="row no-gutters flex-lg-nowrap mb-4">
                  <div class="col-md-2 col-xs-12">
                    <div class="input-group">
                      <div class="form-floating">
                        <input
                          v-model="mmf.amount"
                          id="amount"
                          type="number"
                          step="0.01"
                          @change="validateAmount"
                          :class="' form-control ' + amountErrorData.inputClass"
                        />
                        <label
                          for="amount"
                          :style="'color: ' + amountErrorData.fieldColor"
                          >{{ amountErrorData.fieldLabel }}</label
                        >
                      </div>
                      <span class="input-group-text"
                        ><i class="bi bi-currency-euro"></i
                      ></span>
                    </div>
                  </div>
                  <div class="col-md-4 col-xs-12">
                    <div class="form-floating">
                      <input
                        v-model="mmf.comment"
                        id="comment"
                        type="text"
                        @input="validateComment"
                        :class="'form-control ' + commentErrorData.inputClass"
                      />
                      <label
                        for="comment"
                        :style="'color: ' + commentErrorData.fieldColor"
                        >{{ commentErrorData.fieldLabel }}</label
                      >
                    </div>
                  </div>
                  <div class="col-md-3 col-xs-12">
                    <div class="input-group">
                      <div class="form-floating">
                        <select
                          v-model="mmf.postingaccountid"
                          id="postingaccount"
                          @change="validatePostingaccount"
                          :class="
                            'form-select form-control ' +
                            postingaccountErrorData.inputClass
                          "
                        >
                          <option value="">&nbsp;</option>
                        </select>

                        <label
                          for="postingaccount"
                          :style="
                            'color: ' + postingaccountErrorData.fieldColor
                          "
                          >{{ postingaccountErrorData.fieldLabel }}</label
                        >
                      </div>
                      <span class="input-group-text"
                        ><i class="bi bi-plus"></i
                      ></span>
                    </div>
                  </div>
                  <div
                    class="col-md-3 col-xs-12 d-flex align-items-center justify-content-center"
                  >
                    <div class="btn-group" role="group">
                      <input
                        type="radio"
                        class="btn-check"
                        name="public-private"
                        id="public"
                        autocomplete="off"
                        checked
                      />
                      <label class="btn btn-outline-success" for="public"
                        ><small>&ouml;ffentlich</small></label
                      >

                      <input
                        type="radio"
                        class="btn-check"
                        name="public-private"
                        id="private"
                        autocomplete="off"
                      />
                      <label class="btn btn-outline-danger" for="private"
                        ><small>privat</small></label
                      >
                    </div>
                    &nbsp; &nbsp;
                    <div class="btn-group" role="group">
                      <input
                        type="radio"
                        class="btn-check"
                        name="once-favorite"
                        id="once"
                        autocomplete="off"
                        checked
                      />
                      <label class="btn btn-outline-secondary" for="once"
                        ><small>einmalig</small></label
                      >

                      <input
                        type="radio"
                        class="btn-check"
                        name="once-favorite"
                        id="favorite"
                        autocomplete="off"
                      />
                      <label class="btn btn-outline-primary" for="favorite"
                        ><small>Favorit</small></label
                      >
                    </div>
                  </div>
                </div>

                <div class="row no-gutters flex-lg-nowrap mb-4">
                  <div class="col-12">
                    <div class="card w-100 bg-light d-none d-lg-block">
                      <div class="card-header text-start">
                        <a data-bs-toggle="collapse" href="#collapseExample"
                          >Unterbuchungen</a
                        >
                      </div>
                      <div class="collapse" id="collapseExample">
                        <div class="card-body">blah;</div>
                      </div>
                    </div>
                  </div>
                </div>
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
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ContractpartnerSelectVue from "@/components/contractpartner/ContractpartnerSelect.vue";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { generateErrorData, type ErrorData } from "@/tools/views/ErrorData";
import { defineComponent } from "vue";

type EditMoneyflowData = {
  serverError: string;
  mmf: Moneyflow;
  bookingdateIsValid: boolean | null;
  bookingdateErrorMessage: string;
  invoicedateIsValid: boolean | null;
  invoiceErrorMessage: string;
  contractpartnerIsValid: boolean | null;
  contractpartnerErrorMessage: string;
  capitalsourceIsValid: boolean | null;
  capitalsourceErrorMessage: string;
  amountIsValid: boolean | null;
  amountErrorMessage: string;
  commentIsValid: boolean | null;
  commentErrorMessage: string;
  postingaccountIsValid: boolean | null;
  postingaccountErrorMessage: string;
  bookingdate: string;
  invoicedate: string;
};
export default defineComponent({
  name: "EditMoneyflow",
  data(): EditMoneyflowData {
    return {
      serverError: "",
      mmf: {} as Moneyflow,
      bookingdateIsValid: null,
      bookingdateErrorMessage: "",
      invoicedateIsValid: null,
      invoiceErrorMessage: "",
      contractpartnerIsValid: null,
      contractpartnerErrorMessage: "",
      capitalsourceIsValid: null,
      capitalsourceErrorMessage: "",
      amountIsValid: null,
      amountErrorMessage: "",
      commentIsValid: null,
      commentErrorMessage: "",
      postingaccountIsValid: null,
      postingaccountErrorMessage: "",
      bookingdate: "",
      invoicedate: "",
    };
  },
  mounted() {
    this.resetForm();
  },
  computed: {
    formIsValid() {
      return (
        this.bookingdateIsValid &&
        this.invoicedateIsValid &&
        this.contractpartnerIsValid &&
        this.capitalsourceIsValid &&
        this.amountIsValid &&
        this.commentIsValid &&
        this.postingaccountIsValid
      );
    },
    bookingdateErrorData(): ErrorData {
      return generateErrorData(
        this.bookingdateIsValid,
        "Buchungsdatum",
        this.bookingdateErrorMessage
      );
    },
    invoicedateErrorData(): ErrorData {
      return generateErrorData(
        this.invoicedateIsValid,
        "Rechnungsdatum",
        this.invoiceErrorMessage
      );
    },
    contractpartnerErrorData(): ErrorData {
      return generateErrorData(
        this.contractpartnerIsValid,
        "Vertragspartner",
        this.contractpartnerErrorMessage
      );
    },
    capitalsourceErrorData(): ErrorData {
      return generateErrorData(
        this.capitalsourceIsValid,
        "Kapitalquelle",
        this.capitalsourceErrorMessage
      );
    },
    amountErrorData(): ErrorData {
      return generateErrorData(
        this.amountIsValid,
        "Betrag",
        this.amountErrorMessage
      );
    },
    commentErrorData(): ErrorData {
      return generateErrorData(
        this.commentIsValid,
        "Kommentar",
        this.commentErrorMessage
      );
    },
    postingaccountErrorData(): ErrorData {
      return generateErrorData(
        this.postingaccountIsValid,
        "Buchungskonto",
        this.postingaccountErrorMessage
      );
    },
    validityDate(): Date {
      if (this.invoicedateIsValid) {
        return new Date(this.invoicedate);
      } else if (this.bookingdateIsValid) {
        return new Date(this.bookingdate);
      } else {
        return new Date();
      }
    },
  },
  methods: {
    resetForm() {
      [this.bookingdate] = new Date().toISOString().split("T");
      this.invoicedate = "";
      this.mmf.contractpartnerid = 0;
      this.mmf.capitalsourceid = 0;
      this.mmf.postingaccountid = 0;
      this.mmf.amount = {} as number;
      this.mmf.comment = "";
      this.bookingdateIsValid = null;
      this.invoicedateIsValid = null;
      this.contractpartnerIsValid = null;
      this.capitalsourceIsValid = null;
      this.amountIsValid = null;
      this.commentIsValid = null;
      this.postingaccountIsValid = null;
    },
    validateBookingdate() {
      if (!this.bookingdate) {
        this.bookingdateIsValid = false;
        this.bookingdateErrorMessage = "Datum angeben!";
      } else {
        this.bookingdateIsValid = true;
        this.bookingdateErrorMessage = "";
      }
    },
    validateInvoicedate() {
      this.invoicedateIsValid = true;
      this.invoiceErrorMessage = "";
    },
    validateContractpartner() {
      if (!this.mmf.contractpartnerid) {
        this.contractpartnerIsValid = false;
        this.contractpartnerErrorMessage = "Vertragspartner angeben!";
      } else {
        this.contractpartnerIsValid = true;
        this.contractpartnerErrorMessage = "";
      }
    },
    validateCapitalsource() {
      this.capitalsourceIsValid = true;
      this.capitalsourceErrorMessage = "";
    },
    validateAmount() {
      if (!this.mmf.amount) {
        this.amountIsValid = false;
        this.amountErrorMessage = "Betrag angeben!";
      } else {
        this.amountIsValid = true;
        this.amountErrorMessage = "";
      }
    },
    validateComment() {
      if (!this.mmf.comment) {
        this.commentIsValid = false;
        this.commentErrorMessage = "Kommentar angeben!";
      } else {
        this.commentIsValid = true;
        this.commentErrorMessage = "";
      }
    },
    validatePostingaccount() {
      this.postingaccountIsValid = true;
      this.postingaccountErrorMessage = "";
    },
    onContractpartnerSelected(contractpartnerId: number) {
      this.mmf.contractpartnerid = contractpartnerId;
      this.validateContractpartner();
    },
    saveMoneyflow() {
      this.validateAmount();
      this.validateBookingdate();
      this.validateCapitalsource();
      this.validateComment();
      this.validateContractpartner();
      this.validateInvoicedate();
      this.validatePostingaccount();

      //this.mmf.bookingdate =
      //this.mmf.invoicedate =
      if (this.formIsValid) alert("save");
    },
  },
  components: { ContractpartnerSelectVue },
});
</script>
