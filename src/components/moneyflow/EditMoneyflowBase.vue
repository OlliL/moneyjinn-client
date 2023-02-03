<template>
  <div v-if="serverError">
    <div
      class="alert alert-danger"
      v-for="(error, index) in serverError"
      :key="index"
    >
      {{ error }}
    </div>
  </div>
  <div class="row no-gutters flex-lg-nowrap mb-2">
    <div class="col-md-2 col-xs-12 mb-2">
      <DatepickerVue
        id="bookingdate"
        :label="bookingdateErrorData.fieldLabel"
        :default-date="mmf.bookingDate"
        :input-class="' form-control ' + bookingdateErrorData.inputClass"
        :label-style="'color: ' + bookingdateErrorData.fieldColor"
        @date-selected="bookingdateSelected"
      />
    </div>
    <div class="col-md-2 col-xs-12 mb-2">
      <DatepickerVue
        id="invoicedate"
        label="Rechnungsdatum"
        :default-date="mmf.invoiceDate"
        @date-selected="invoicedateSelected"
      />
    </div>
    <div class="col-md-4 col-xs-12 mb-2">
      <ContractpartnerSelectVue
        :field-color="contractpartnerErrorData.fieldColor"
        :field-label="contractpartnerErrorData.fieldLabel"
        :input-class="contractpartnerErrorData.inputClass"
        :validity-date="validityDate"
        :selected-id="mmf.contractpartnerId"
        :id-suffix="'CreateMoneyflow' + idSuffix"
        @contractpartner-selected="onContractpartnerSelected"
      />
    </div>

    <div class="col-md-4 col-xs-12 mb-2">
      <CapitalsourceSelectVue
        :field-color="capitalsourceErrorData.fieldColor"
        :field-label="capitalsourceErrorData.fieldLabel"
        :input-class="capitalsourceErrorData.inputClass"
        :validity-date="validityDate"
        :selected-id="mmf.capitalsourceId"
        :id-suffix="'CreateMoneyflow' + idSuffix"
        @capitalsource-selected="onCapitalsourceSelected"
      />
    </div>
  </div>

  <div class="row no-gutters flex-lg-nowrap mb-2">
    <div class="col-md-2 col-xs-12 mb-2">
      <div class="input-group">
        <div class="form-floating">
          <input
            v-model="amount"
            :id="'amount' + idSuffix"
            type="number"
            step="0.01"
            @change="validateAmount"
            :class="' form-control text-end ' + amountErrorData.inputClass"
            ref="amountRef"
          />
          <label
            :for="'amount' + idSuffix"
            :style="'color: ' + amountErrorData.fieldColor"
            >{{ amountErrorData.fieldLabel }}</label
          >
        </div>
        <span class="input-group-text"
          ><i class="bi bi-currency-euro"></i
        ></span>
      </div>
    </div>
    <div class="col-md-7" v-show="!showMoneyflowFields"></div>
    <div class="col-md-4 col-xs-12 mb-2" v-show="showMoneyflowFields">
      <div class="form-floating">
        <input
          v-model="mmf.comment"
          :id="'comment' + idSuffix"
          type="text"
          @input="validateComment"
          :class="'form-control ' + commentErrorData.inputClass"
        />
        <label
          :for="'comment' + idSuffix"
          :style="'color: ' + commentErrorData.fieldColor"
          >{{ commentErrorData.fieldLabel }}</label
        >
      </div>
    </div>
    <div class="col-md-3 col-xs-12 mb-2" v-show="showMoneyflowFields">
      <PostingAccountSelectVue
        :field-color="postingaccountErrorData.fieldColor"
        :field-label="postingaccountErrorData.fieldLabel"
        :input-class="postingaccountErrorData.inputClass"
        :selected-id="mmf.postingAccountId"
        :id-suffix="'CreateMoneyflow' + idSuffix"
        @posting-account-selected="onPostingAccountSelected"
      />
    </div>
    <div
      class="col-md-3 col-xs-12 mb-2 d-flex align-items-center justify-content-center"
    >
      <div class="btn-group mx-2" role="group">
        <input
          type="radio"
          class="btn-check"
          name="public-private"
          :id="'public' + idSuffix"
          autocomplete="off"
          v-model="mmf.private"
          :value="false"
        />
        <label class="btn btn-outline-success" :for="'public' + idSuffix"
          ><small>&ouml;ffentlich</small></label
        >

        <input
          type="radio"
          class="btn-check"
          name="public-private"
          :id="'private' + idSuffix"
          autocomplete="off"
          v-model="mmf.private"
          :value="true"
        />
        <label class="btn btn-outline-danger" :for="'private' + idSuffix"
          ><small>privat</small></label
        >
      </div>
      <div class="btn-group mx-2" role="group">
        <input
          type="radio"
          class="btn-check"
          name="once-favorite"
          :id="'once' + idSuffix"
          autocomplete="off"
          v-model="saveAsPreDefMoneyflow"
          :value="false"
        />
        <label class="btn btn-outline-secondary" :for="'once' + idSuffix"
          ><small>{{ toggleTextOff }}</small></label
        >

        <input
          type="radio"
          class="btn-check"
          name="once-favorite"
          :id="'favorite' + idSuffix"
          autocomplete="off"
          v-model="saveAsPreDefMoneyflow"
          :value="true"
        />
        <label class="btn btn-outline-primary" :for="'favorite' + idSuffix"
          ><small>{{ toggleTextOn }}</small></label
        >
      </div>
    </div>
  </div>

  <div class="row no-gutters flex-lg-nowrap mb-4">
    <div class="col-12">
      <div class="card w-100 bg-light d-none d-lg-block">
        <div class="card-header text-start">
          <a
            data-bs-toggle="collapse"
            :href="'#collapseSplitEntries' + idSuffix"
            :id="'mseContainer' + idSuffix"
            ref="mseContainer"
            >Unterbuchungen</a
          >
        </div>
        <div class="collapse" :id="'collapseSplitEntries' + idSuffix">
          <div class="card-body">
            <EditMoneyflowBaseSplitEntryRowVue
              v-for="(mse, index) in mmf.moneyflowSplitEntries"
              ref="mseRow"
              :key="mse.id"
              :amount="mse.amount"
              :comment="mse.comment"
              :moneyflowComment="mmf.comment"
              :moneyflowPostingAccountId="mmf.postingAccountId"
              :posting-account-id="mse.postingAccountId"
              :is-last-row="index + 1 === mmf.moneyflowSplitEntries?.length"
              :index="index"
              :remainder="mseRemainder"
              :remainder-is-valid="mseRemainderIsValid"
              @delete-moneyflow-split-entry-row="onDeleteMoneyflowSplitEntryRow"
              @add-moneyflow-split-entry-row="onAddMoneyflowSplitEntryRow"
              @amount-changed="onMoneyflowSplitEntryRowAmountChanged"
              @comment-changed="onMoneyflowSplitEntryRowCommentChanged"
              @posting-account-id-changed="
                onMoneyflowSplitEntryRowPostingAccountIdChanged
              "
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch, type PropType } from "vue";

import CapitalsourceSelectVue from "@/components/capitalsource/CapitalsourceSelect.vue";
import ContractpartnerSelectVue from "@/components/contractpartner/ContractpartnerSelect.vue";
import EditMoneyflowBaseSplitEntryRowVue from "@/components/moneyflow/EditMoneyflowBaseSplitEntryRow.vue";
import PostingAccountSelectVue from "@/components/postingaccount/PostingAccountSelect.vue";
import DatepickerVue from "@/components/Datepicker.vue";

import { useContractpartnerStore } from "@/stores/ContractpartnerStore";

import { generateErrorData } from "@/tools/views/ErrorData";
import { getError } from "@/tools/views/ThrowError";
import { toFixed } from "@/tools/math";
import { validateInputField } from "@/tools/views/ValidateInputField";

import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import type { ImportedMoneyflow } from "@/model/moneyflow/ImportedMoneyflow";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import type { MoneyflowSplitEntry } from "@/model/moneyflow/MoneyflowSplitEntry";
import type { MoneyflowValidation } from "@/model/moneyflow/MoneyflowValidation";
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import type { ValidationResult } from "@/model/validation/ValidationResult";

import MoneyflowControllerHandler from "@/handler/MoneyflowControllerHandler";

import ImportedMoneyflowControllerHandler from "@/handler/ImportedMoneyflowControllerHandler";

const serverError = ref(undefined as Array<string> | undefined);
const mmf = ref({} as Moneyflow);
const amount = ref(undefined as number | undefined);
const bookingdateIsValid = ref(null as boolean | null);
const bookingdateErrorMessage = ref("");
const contractpartnerIsValid = ref(null as boolean | null);
const contractpartnerErrorMessage = ref("");
const capitalsourceIsValid = ref(null as boolean | null);
const capitalsourceErrorMessage = ref("");
const amountIsValid = ref(null as boolean | null);
const amountErrorMessage = ref("");
const commentIsValid = ref(null as boolean | null);
const commentErrorMessage = ref("");
const postingaccountIsValid = ref(null as boolean | null);
const postingaccountErrorMessage = ref("");
const previousCommentSetByContractpartnerDefaults = ref("");
const previousPostingAccountSetByContractpartnerDefaults = ref(0);
const preDefMoneyflowId = ref(0);
const saveAsPreDefMoneyflow = ref(false);
const toggleTextOffNoPreDefMoneyflow = ref("einmalig");
const toggleTextOnNoPreDefMoneyflow = ref("Favorit");
const toggleTextOffPreDefMoneyflow = ref("belassen");
const toggleTextOnPreDefMoneyflow = ref("erneuern");
const toggleTextOff = ref("");
const toggleTextOn = ref("");
const mseRowsAreValid = ref(null as boolean | null);
const mseRemainderIsValid = ref(undefined as boolean | undefined);
const showMoneyflowFields = ref(true);
const originalMoneyflowSplitEntryIds = ref(new Array<number>());
const amountRef = ref();
const mseRow = ref();
const contractpartnerStore = useContractpartnerStore();

const props = defineProps({
  mmfToEdit: {
    type: Object as PropType<Moneyflow>,
    required: false,
  },
  selectedPreDefMoneyflow: {
    type: Object as PropType<PreDefMoneyflow>,
    required: false,
  },
  idSuffix: {
    type: String,
    default: "",
  },
  fillContractpartnerDefaults: {
    type: Boolean,
    default: false,
  },
});
onMounted(() => {
  if (props.fillContractpartnerDefaults) resetForm();
});

watch(
  () => props.selectedPreDefMoneyflow,
  (newVal, oldVal) => {
    if (newVal !== oldVal) selectPreDefMoneyflow(newVal);
  }
);

watch(
  () => props.mmfToEdit,
  (newVal, oldVal) => {
    if (newVal !== oldVal) resetForm();
  }
);

const formIsValid = computed(() => {
  const isValid =
    bookingdateIsValid.value &&
    contractpartnerIsValid.value &&
    capitalsourceIsValid.value &&
    amountIsValid.value &&
    commentIsValid.value &&
    postingaccountIsValid.value &&
    mseRowsAreValid.value &&
    mseRemainderIsValid.value;
  if (isValid === null || isValid === undefined || isValid === true) {
    return true;
  }
  return false;
});
const bookingdateErrorData = computed(() => {
  return generateErrorData(
    bookingdateIsValid.value,
    "Buchungsdatum",
    bookingdateErrorMessage.value
  );
});
const contractpartnerErrorData = computed(() => {
  return generateErrorData(
    contractpartnerIsValid.value,
    "Vertragspartner",
    contractpartnerErrorMessage.value
  );
});
const capitalsourceErrorData = computed(() => {
  return generateErrorData(
    capitalsourceIsValid.value,
    "Kapitalquelle",
    capitalsourceErrorMessage.value
  );
});
const amountErrorData = computed(() => {
  return generateErrorData(
    amountIsValid.value,
    "Betrag",
    amountErrorMessage.value
  );
});
const commentErrorData = computed(() => {
  return generateErrorData(
    commentIsValid.value,
    "Kommentar",
    commentErrorMessage.value
  );
});
const postingaccountErrorData = computed(() => {
  return generateErrorData(
    postingaccountIsValid.value,
    "Buchungskonto",
    postingaccountErrorMessage.value
  );
});
const validityDate = computed(() => {
  if (mmf.value.invoiceDate) {
    return mmf.value.invoiceDate;
  } else if (bookingdateIsValid.value) {
    return mmf.value.bookingDate;
  } else {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }
});
const mseRemainder = computed(() => {
  // avoid floating arithmetic problems by using fixed point arithmetics
  let remainder = 0;
  if (amount.value) {
    remainder = toFixed(amount.value, 2);
    if (mmf.value.moneyflowSplitEntries != undefined) {
      for (const mse of mmf.value.moneyflowSplitEntries) {
        if (mse.amount) remainder = toFixed(remainder - mse.amount, 2);
      }
    }
  }
  return remainder;
});

const resetForm = () => {
  if (props.mmfToEdit && props.mmfToEdit.bookingDate) {
    const bookingDate = new Date(props.mmfToEdit.bookingDate);
    bookingDate.setHours(0, 0, 0, 0);
    let invoiceDate: Date | undefined = undefined;
    if (props.mmfToEdit.invoiceDate) {
      invoiceDate = new Date(props.mmfToEdit.invoiceDate);
      invoiceDate.setHours(0, 0, 0, 0);
    }

    mmf.value = {
      amount: props.mmfToEdit.amount,
      bookingDate: bookingDate,
      capitalsourceId: props.mmfToEdit.capitalsourceId,
      comment: props.mmfToEdit.comment,
      contractpartnerId: props.mmfToEdit.contractpartnerId,
      hasReceipt: props.mmfToEdit.hasReceipt,
      id: props.mmfToEdit.id,
      invoiceDate: invoiceDate,
      postingAccountId: props.mmfToEdit.postingAccountId,
      private: props.mmfToEdit.private,
      userId: props.mmfToEdit.userId,
      capitalsourceComment: props.mmfToEdit.capitalsourceComment,
      contractpartnerName: props.mmfToEdit.contractpartnerName,
      moneyflowSplitEntries: props.mmfToEdit.moneyflowSplitEntries,
      postingAccountName: props.mmfToEdit.postingAccountName,
    };

    amount.value = mmf.value.amount;

    // set correct defaults for imported moneyflows
    if (mmf.value.comment === undefined) mmf.value.comment = "";
    if (mmf.value.postingAccountId === undefined)
      mmf.value.postingAccountId = 0;

    originalMoneyflowSplitEntryIds.value = new Array<number>();
    if (props.fillContractpartnerDefaults && mmf.value.contractpartnerId > 0) {
      previousCommentSetByContractpartnerDefaults.value = mmf.value.comment;
      previousPostingAccountSetByContractpartnerDefaults.value =
        mmf.value.postingAccountId;

      const contractpartner = contractpartnerStore.getContractpartner(
        mmf.value.contractpartnerId
      );
      if (contractpartner) {
        onContractpartnerSelected(contractpartner);
      }
    } else {
      previousCommentSetByContractpartnerDefaults.value = "";
      previousPostingAccountSetByContractpartnerDefaults.value = 0;
    }

    if (mmf.value.moneyflowSplitEntries == undefined) {
      mmf.value.moneyflowSplitEntries = new Array<MoneyflowSplitEntry>();
      addNewMoneyflowSplitEntryRow();
      addNewMoneyflowSplitEntryRow();
      document.getElementById("collapseSplitEntries")?.classList.remove("show");
    } else {
      for (let mse of mmf.value.moneyflowSplitEntries) {
        originalMoneyflowSplitEntryIds.value.push(mse.id);
      }
      addNewMoneyflowSplitEntryRow();
      document.getElementById("collapseSplitEntries")?.classList.add("show");
    }
    toggleMoneyflowFieldsForMse();
  } else {
    amount.value = undefined;

    const bookingDate = new Date();
    bookingDate.setHours(0, 0, 0, 0);
    mmf.value.bookingDate = bookingDate;
    mmf.value.invoiceDate = undefined;
    mmf.value.contractpartnerId = 0;
    mmf.value.contractpartnerName = "";
    mmf.value.capitalsourceId = 0;
    mmf.value.capitalsourceComment = "";
    mmf.value.postingAccountId = 0;
    mmf.value.postingAccountName = "";
    mmf.value.comment = "";
    mmf.value.private = false;

    mmf.value.moneyflowSplitEntries = new Array<MoneyflowSplitEntry>();
    addNewMoneyflowSplitEntryRow();
    addNewMoneyflowSplitEntryRow();
    showMoneyflowFields.value = true;

    (amountRef.value as any).focus();
    previousCommentSetByContractpartnerDefaults.value = "";
    previousPostingAccountSetByContractpartnerDefaults.value = 0;
  }
  serverError.value = undefined;
  mseRowsAreValid.value = null;
  mseRemainderIsValid.value = undefined;

  saveAsPreDefMoneyflow.value = false;
  preDefMoneyflowId.value = 0;

  bookingdateIsValid.value = null;
  contractpartnerIsValid.value = null;
  capitalsourceIsValid.value = null;
  amountIsValid.value = null;
  commentIsValid.value = null;
  postingaccountIsValid.value = null;

  toggleTextOff.value = toggleTextOffNoPreDefMoneyflow.value;
  toggleTextOn.value = toggleTextOnNoPreDefMoneyflow.value;
};
/*
 * Moneyflow Split Entry handling
 */
const addNewMoneyflowSplitEntryRow = () => {
  if (mmf.value.moneyflowSplitEntries !== undefined) {
    const mse = mmf.value.moneyflowSplitEntries;
    const mseLength = mse.length;
    let newMseId = -1;
    if (mseLength > 0) {
      // existing MoneyflowSplitEntries have positive IDs, new created rows must always have negative IDs
      newMseId =
        Math.abs(mmf.value.moneyflowSplitEntries[mseLength - 1].id) * -1 - 1;
    }
    const newMse = {
      id: newMseId,
      moneyflowId: mmf.value.id,
      amount: 0,
      comment: "",
      postingAccountId: 0,
    } as MoneyflowSplitEntry;
    mse.push(newMse);
  }
};
const onDeleteMoneyflowSplitEntryRow = (index: number) => {
  const mse = mmf.value.moneyflowSplitEntries;
  if (mse !== undefined) {
    if (mse.length === 2) {
      addNewMoneyflowSplitEntryRow();
    }
    mse.splice(index, 1);
    validateMseRemainder();
    toggleMoneyflowFieldsForMse();
  }
};
const onAddMoneyflowSplitEntryRow = () => {
  addNewMoneyflowSplitEntryRow();
};
const onMoneyflowSplitEntryRowAmountChanged = (
  index: number,
  amount: number
) => {
  const mse = mmf.value.moneyflowSplitEntries;
  if (mse !== undefined) {
    mse[index]["amount"] = amount;
  }
  validateMseRemainder();
  toggleMoneyflowFieldsForMse();
};
const onMoneyflowSplitEntryRowCommentChanged = (
  index: number,
  comment: string
) => {
  const mse = mmf.value.moneyflowSplitEntries;
  if (mse !== undefined) {
    mse[index]["comment"] = comment;
  }
  validateMseRemainder();
  toggleMoneyflowFieldsForMse();
};
const onMoneyflowSplitEntryRowPostingAccountIdChanged = (
  index: number,
  postingAccountId: number,
  postingAccountName: string
) => {
  const mse = mmf.value.moneyflowSplitEntries;
  if (mse !== undefined) {
    mse[index]["postingAccountId"] = postingAccountId;
    mse[index]["postingAccountName"] = postingAccountName;
  }
  validateMseRemainder();
  toggleMoneyflowFieldsForMse();
};
const toggleMoneyflowFieldsForMse = () => {
  showMoneyflowFields.value = allMseRowsAreEmpty();
};
const allMseRowsAreEmpty = (): boolean => {
  let allMseRowsAreEmpty = true;
  const mse = mmf.value.moneyflowSplitEntries;
  if (mse !== undefined) {
    for (let entry of mse) {
      if (
        entry.amount !== 0 ||
        entry.comment != "" ||
        entry.postingAccountId !== 0
      ) {
        allMseRowsAreEmpty = false;
        break;
      }
    }
  }
  return allMseRowsAreEmpty;
};
const validateMseRemainder = () => {
  if (allMseRowsAreEmpty() || mseRemainder.value === 0) {
    mseRemainderIsValid.value = undefined;
  } else {
    mseRemainderIsValid.value = false;
  }
};
const validateMseRows = () => {
  let mseRowsValid = true;

  const mseRowRefs = mseRow.value as Array<
    typeof EditMoneyflowBaseSplitEntryRowVue
  >;
  for (let ref of mseRowRefs) {
    const valid = ref.validateRow() as boolean;
    mseRowsValid &&= valid;
  }

  mseRowsAreValid.value = mseRowsValid;
};
/*
 * Moneyflow handling
 */
const validateBookingdate = () => {
  [bookingdateIsValid.value, bookingdateErrorMessage.value] =
    validateInputField(mmf.value.bookingDate, "Datum angeben!");
};
const validateContractpartner = () => {
  [contractpartnerIsValid.value, contractpartnerErrorMessage.value] =
    validateInputField(mmf.value.contractpartnerId, "Vertragspartner angeben!");
};
const validateCapitalsource = () => {
  [capitalsourceIsValid.value, capitalsourceErrorMessage.value] =
    validateInputField(mmf.value.capitalsourceId, "Kapitalquelle angeben!");
};
const validateAmount = () => {
  [amountIsValid.value, amountErrorMessage.value] = validateInputField(
    amount.value,
    "Betrag angeben!"
  );
};
const validateComment = () => {
  [commentIsValid.value, commentErrorMessage.value] = validateInputField(
    mmf.value.comment,
    "Kommentar angeben!"
  );
};
const validatePostingaccount = () => {
  [postingaccountIsValid.value, postingaccountErrorMessage.value] =
    validateInputField(mmf.value.postingAccountId, "Buchungskonto angeben!");
};
const onContractpartnerSelected = (contractpartner: Contractpartner) => {
  if (contractpartner) {
    mmf.value.contractpartnerId = contractpartner.id;
    mmf.value.contractpartnerName = contractpartner.name;
    if (
      mmf.value.comment === previousCommentSetByContractpartnerDefaults.value
    ) {
      mmf.value.comment = contractpartner.moneyflowComment;
      previousCommentSetByContractpartnerDefaults.value =
        contractpartner.moneyflowComment;
      if (contractpartner.moneyflowComment) validateComment();
      else commentIsValid.value = null;
    }
    if (
      mmf.value.postingAccountId ===
      previousPostingAccountSetByContractpartnerDefaults.value
    ) {
      const mpaId = contractpartner.postingAccountId
        ? contractpartner.postingAccountId
        : 0;

      mmf.value.postingAccountId = mpaId;
      previousPostingAccountSetByContractpartnerDefaults.value = mpaId;
      if (contractpartner.postingAccountId) validatePostingaccount();
      else postingaccountIsValid.value = null;
    }
  } else {
    mmf.value.contractpartnerId = 0;
    mmf.value.contractpartnerName = "";
    if (
      mmf.value.comment === previousCommentSetByContractpartnerDefaults.value
    ) {
      mmf.value.comment = "";
      previousCommentSetByContractpartnerDefaults.value = "";
      commentIsValid.value = null;
    }
    if (
      mmf.value.postingAccountId ===
      previousPostingAccountSetByContractpartnerDefaults.value
    ) {
      mmf.value.postingAccountId = 0;
      previousPostingAccountSetByContractpartnerDefaults.value = 0;
      postingaccountIsValid.value = null;
    }
  }
  validateContractpartner();
};
const onCapitalsourceSelected = (capitalsource: Capitalsource) => {
  if (capitalsource) {
    mmf.value.capitalsourceId = capitalsource.id;
    mmf.value.capitalsourceComment = capitalsource.comment;
  } else {
    mmf.value.capitalsourceId = 0;
    mmf.value.capitalsourceComment = "";
  }
  validateCapitalsource();
};
const onPostingAccountSelected = (postingAccount: PostingAccount) => {
  if (postingAccount) {
    mmf.value.postingAccountId = postingAccount.id;
    mmf.value.postingAccountName = postingAccount.name;
  } else {
    mmf.value.postingAccountId = 0;
    mmf.value.postingAccountName = "";
  }
  validatePostingaccount();
};
const selectPreDefMoneyflow = (
  preDefMoneyflow: PreDefMoneyflow | undefined
) => {
  if (preDefMoneyflow === undefined) {
    resetForm();
  } else {
    if (preDefMoneyflow) {
      amount.value = preDefMoneyflow.amount;
      mmf.value.contractpartnerId = preDefMoneyflow.contractpartnerId;
      mmf.value.comment = preDefMoneyflow.comment;
      mmf.value.postingAccountId = preDefMoneyflow.postingAccountId;
      mmf.value.capitalsourceId = preDefMoneyflow.capitalsourceId;

      toggleTextOff.value = toggleTextOffPreDefMoneyflow.value;
      toggleTextOn.value = toggleTextOnPreDefMoneyflow.value;
      preDefMoneyflowId.value = preDefMoneyflow.id;
    }
  }
};
const bookingdateSelected = (date: Date) => {
  mmf.value.bookingDate = date;
  validateBookingdate();
};
const invoicedateSelected = (date: Date) => {
  mmf.value.invoiceDate = date;
};
const prepareServerCall = (): boolean => {
  validateMseRows();
  validateMseRemainder();
  if (!allMseRowsAreEmpty() && mmf.value.moneyflowSplitEntries) {
    let mse = {} as MoneyflowSplitEntry;
    for (let filledMse of mmf.value.moneyflowSplitEntries) {
      if (filledMse.comment && filledMse.postingAccountId) {
        mse = filledMse;
        break;
      }
    }
    if (!mmf.value.comment) {
      mmf.value.comment = mse.comment;
    }
    if (!mmf.value.postingAccountId) {
      mmf.value.postingAccountId = mse.postingAccountId;
    }
  }

  validateAmount();
  validateBookingdate();
  validateCapitalsource();
  validateComment();
  validateContractpartner();
  validatePostingaccount();

  if (formIsValid.value) {
    if (amount.value) mmf.value.amount = amount.value;
    // remove empty rows
    if (mmf.value.moneyflowSplitEntries) {
      mmf.value.moneyflowSplitEntries = mmf.value.moneyflowSplitEntries.filter(
        (mse) => mse.amount && mse.comment && mse.postingAccountId
      );
    }
    return true;
  }
  return false;
};
const followUpServerCall = (validationResult: ValidationResult): boolean => {
  if (!validationResult.result) {
    serverError.value = new Array<string>();
    for (let resultItem of validationResult.validationResultItems) {
      serverError.value.push(getError(resultItem.error));
    }
    if (mmf.value.moneyflowSplitEntries) {
      while (mmf.value.moneyflowSplitEntries.length < 2) {
        addNewMoneyflowSplitEntryRow();
      }
    }
    return false;
  }
  return true;
};
const importImportedMoneyflow = async (mim: ImportedMoneyflow) => {
  if (prepareServerCall()) {
    const importedMoneyflow: ImportedMoneyflow = {
      ...mmf.value,
      accountNumber: mim.accountNumber,
      bankCode: mim.bankCode,
      externalid: mim.externalid,
      name: mim.name,
      usage: mim.usage,
      accountNumberCapitalsource: mim.accountNumberCapitalsource,
      bankCodeCapitalsource: mim.bankCodeCapitalsource,
    };
    const validationResult =
      await ImportedMoneyflowControllerHandler.importImportedMoneyflow(
        importedMoneyflow
      );
    if (followUpServerCall(validationResult)) {
      return true;
    }
  }
  return false;
};
const deleteImportedMoneyflow = async (id: number) => {
  await ImportedMoneyflowControllerHandler.deleteImportedMoneyflow(id);
};
const createMoneyflow = async (): Promise<boolean> => {
  if (prepareServerCall()) {
    const validationResult = await MoneyflowControllerHandler.createMoneyflow(
      mmf.value,
      preDefMoneyflowId.value,
      saveAsPreDefMoneyflow.value
    );
    if (followUpServerCall(validationResult)) {
      return true;
    }
  }
  return false;
};
const updateMoneyflow = async (): Promise<Moneyflow | undefined> => {
  if (prepareServerCall()) {
    const createMses = new Array<MoneyflowSplitEntry>();
    const updateMses = new Array<MoneyflowSplitEntry>();
    const updateMseIds = new Array<number>();
    if (mmf.value.moneyflowSplitEntries) {
      for (let mse of mmf.value.moneyflowSplitEntries) {
        if (mse.id < 0) {
          createMses.push(mse);
        } else {
          updateMses.push(mse);
          updateMseIds.push(mse.id);
        }
      }
    }
    const deleteMseIds = originalMoneyflowSplitEntryIds.value.filter(
      (mseId) => !updateMseIds.includes(mseId)
    );

    const moneyflowValidation: MoneyflowValidation =
      await MoneyflowControllerHandler.updateMoneyflow(
        mmf.value,
        createMses,
        updateMses,
        deleteMseIds
      );
    const validationResult: ValidationResult =
      moneyflowValidation.validationResult;
    if (followUpServerCall(validationResult)) {
      return moneyflowValidation.mmf;
    }
  }
  return undefined;
};

defineExpose([
  createMoneyflow,
  updateMoneyflow,
  resetForm,
  importImportedMoneyflow,
  deleteImportedMoneyflow,
]);
</script>
