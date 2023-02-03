<template>
  <div class="row p-1">
    <div class="col-md-1 d-flex align-items-center justify-content-start">
      <div class="btn-group" role="group">
        <button
          type="button"
          class="btn btn-primary"
          @click="deleteMoneyflowSplitEntryRow"
        >
          <i class="bi bi-dash"></i></button
        ><button
          type="button"
          class="btn btn-primary"
          @click="addMoneyflowSplitEntryRow"
          v-if="isLastRow"
        >
          <i class="bi bi-plus"></i>
        </button>
      </div>
    </div>
    <div class="col-md-2 col-xs-12">
      <div class="input-group">
        <div class="form-floating">
          <input
            v-model="mseAmount"
            id="amount"
            type="number"
            step="0.01"
            @change="amountChangedWithNewRow"
            :class="' form-control text-end ' + amountErrorData.inputClass"
          />
          <label for="amount" :style="'color: ' + amountErrorData.fieldColor">{{
            amountErrorData.fieldLabel
          }}</label>
        </div>
        <span class="input-group-text"
          ><i class="bi bi-currency-euro"></i
        ></span>
      </div>
    </div>
    <div class="col-md-4 col-xs-12">
      <div class="form-floating">
        <input
          v-model="mseComment"
          id="comment"
          type="text"
          @change="commentChangedWithNewRow"
          :class="'form-control ' + commentErrorData.inputClass"
        />
        <label for="comment" :style="'color: ' + commentErrorData.fieldColor">{{
          commentErrorData.fieldLabel
        }}</label>
      </div>
    </div>
    <div class="col-md-3 col-xs-12">
      <PostingAccountSelectVue
        :field-color="postingaccountErrorData.fieldColor"
        :field-label="postingaccountErrorData.fieldLabel"
        :input-class="postingaccountErrorData.inputClass"
        :selected-id="msePostingAccountId"
        @posting-account-selected="onPostingAccountSelected"
      />
    </div>
    <div class="col-md-2 col-xs-12" v-if="showRemainder">
      <div class="input-group">
        <span class="input-group-text" role="button" @click="useRemainder"
          ><i class="bi bi-arrow-left"></i
        ></span>
        <div class="form-floating">
          <input
            id="remainder"
            disabled
            type="text"
            :class="'form-control ' + remainderErrorData.inputClass"
            :value="remainder.toFixed(2)"
          />
          <label
            for="comment"
            :style="'color: ' + remainderErrorData.fieldColor"
            >{{ remainderErrorData.fieldLabel }}</label
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from "vue";

import PostingAccountSelectVue from "@/components/postingaccount/PostingAccountSelect.vue";

import { generateErrorData } from "@/tools/views/ErrorData";
import { validateInputField } from "@/tools/views/ValidateInputField";

import type { PostingAccount } from "@/model/postingaccount/PostingAccount";

const amountIsValid = ref(null as boolean | null);
const amountErrorMessage = ref("");
const commentIsValid = ref(null as boolean | null);
const commentErrorMessage = ref("");
const postingaccountIsValid = ref(null as boolean | null);
const postingaccountErrorMessage = ref("");
const mseAmount = ref(undefined as number | undefined);
const mseComment = ref(undefined as string | undefined);
const msePostingAccountId = ref(0);
const msePostingAccountName = ref(undefined as string | undefined);

const emit = defineEmits([
  "deleteMoneyflowSplitEntryRow",
  "addMoneyflowSplitEntryRow",
  "amountChanged",
  "commentChanged",
  "postingAccountIdChanged",
]);

const props = defineProps({
  amount: {
    type: Number,
    required: false,
  },
  comment: {
    type: String,
    required: false,
  },
  postingAccountId: {
    type: Number,
    required: false,
  },
  isLastRow: {
    type: Boolean,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  remainder: {
    type: Number,
    required: true,
  },
  remainderIsValid: {
    type: Boolean,
    required: false,
  },
  moneyflowComment: {
    type: String,
    required: false,
  },
  moneyflowPostingAccountId: {
    type: Number,
    required: false,
  },
});

const showRemainder = computed(() => {
  return props.isLastRow && props.remainder != 0;
});
const rowEmpty = computed(() => {
  return !mseAmount.value && !mseComment.value && !msePostingAccountId.value;
});
const formIsValid = computed(() => {
  return (
    rowEmpty.value ||
    (amountIsValid.value && commentIsValid.value && postingaccountIsValid.value)
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
const remainderErrorData = computed(() => {
  return generateErrorData(props.remainderIsValid, "Rest", "Rest muss 0 sein!");
});

watch(
  () => props.amount,
  (newVal, oldVal) => {
    // we want to display an empty amount field when 0 is the amount!
    if (newVal === 0) mseAmount.value = undefined;
    else if (newVal !== oldVal) mseAmount.value = newVal;
  },
  { immediate: true }
);

watch(
  () => props.comment,
  (newVal, oldVal) => {
    if (newVal != oldVal) mseComment.value = newVal;
  },
  { immediate: true }
);
watch(
  () => props.postingAccountId,
  (newVal, oldVal) => {
    if (newVal != oldVal) msePostingAccountId.value = newVal ? newVal : 0;
  },
  { immediate: true }
);
watch(rowEmpty, (newVal, oldVal) => {
  // remove all form errors when the row becomes empty again
  if (newVal != oldVal && newVal == true) validateRow();
});

const deleteMoneyflowSplitEntryRow = () => {
  emit("deleteMoneyflowSplitEntryRow", props.index);
};
const addMoneyflowSplitEntryRow = () => {
  emit("addMoneyflowSplitEntryRow");
};
/*
 * Amount
 */
const amountChangedWithNewRow = () => {
  amountChanged();
  if (props.isLastRow) addMoneyflowSplitEntryRow();
};
const amountChanged = () => {
  validateAmount();
  let amount = mseAmount.value;
  // when amount is empty, we must send 0 because its a number
  if (!amount) amount = 0;
  emit("amountChanged", props.index, amount);
};
const validateAmount = () => {
  if (!rowEmpty.value) {
    [amountIsValid.value, amountErrorMessage.value] = validateInputField(
      mseAmount.value,
      "Betrag angeben!"
    );
  } else {
    amountIsValid.value = null;
  }
};
/*
 * Comment
 */
const commentChangedWithNewRow = () => {
  commentChanged();
  if (props.isLastRow) addMoneyflowSplitEntryRow();
};
const commentChanged = () => {
  validateComment();
  emit("commentChanged", props.index, mseComment.value);
};
const validateComment = () => {
  if (!rowEmpty.value) {
    [commentIsValid.value, commentErrorMessage.value] = validateInputField(
      mseComment.value,
      "Kommentar angeben!"
    );
  } else {
    commentIsValid.value = null;
  }
};
/*
 * PostingAccount
 */
const postingaccountChangedWithNewRow = () => {
  postingaccountChanged();
  if (props.isLastRow) addMoneyflowSplitEntryRow();
};
const postingaccountChanged = () => {
  validatePostingaccount();
  emit(
    "postingAccountIdChanged",
    props.index,
    msePostingAccountId.value,
    msePostingAccountName.value
  );
};
const validatePostingaccount = () => {
  if (!rowEmpty.value) {
    [postingaccountIsValid.value, postingaccountErrorMessage.value] =
      validateInputField(msePostingAccountId.value, "Buchungskonto angeben!");
  } else {
    postingaccountIsValid.value = null;
  }
};
const validateRow = (): boolean => {
  validateAmount();
  validateComment();
  validatePostingaccount();
  return !!formIsValid.value;
};
const onPostingAccountSelected = (postingAccount: PostingAccount) => {
  // can be undefined when first empty option is selected
  if (postingAccount) {
    msePostingAccountId.value = postingAccount.id;
    msePostingAccountName.value = postingAccount.name;
  } else {
    msePostingAccountId.value = 0;
    msePostingAccountName.value = "";
  }
  postingaccountChangedWithNewRow();
};
const useRemainder = () => {
  mseAmount.value = props.remainder;
  amountChanged();

  if (props.moneyflowComment) {
    mseComment.value = props.moneyflowComment;
    commentChanged();
  }

  if (props.moneyflowPostingAccountId) {
    msePostingAccountId.value = props.moneyflowPostingAccountId;
    postingaccountChanged();
  }

  if (props.isLastRow) addMoneyflowSplitEntryRow();
};
defineExpose({ validateRow });
</script>
