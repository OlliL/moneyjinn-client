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
      <InputStandard
        v-model="mseAmount"
        :validation-schema-ref="schema.amount"
        :id="'amountSplitEntry' + idSuffix"
        field-type="number"
        step="0.01"
        :field-label="$t('General.amount')"
      >
        <template #icon
          ><span class="input-group-text"
            ><i class="bi bi-currency-euro"></i></span
        ></template>
      </InputStandard>
    </div>
    <div class="col-md-4 col-xs-12">
      <InputStandard
        v-model="mseComment"
        :validation-schema-ref="schema.comment"
        :id="'commentSplitEntry' + idSuffix"
        :field-label="$t('General.comment')"
        name="comment"
      />
    </div>
    <div class="col-md-3 col-xs-12">
      <SelectPostingAccount
        v-model="msePostingAccountId"
        :validation-schema-ref="schema.postingAccountId"
        :field-label="$t('General.postingAccount')"
        :id-suffix="'SplitEntry' + idSuffix"
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
import { useI18n } from "vue-i18n";

import { generateErrorData } from "@/tools/views/ErrorData";

import { amountSchema, globErr } from "@/tools/views/ZodUtil";
import { any, number, string } from "zod";
import InputStandard from "../InputStandard.vue";
import SelectPostingAccount from "../postingaccount/SelectPostingAccount.vue";

const { t } = useI18n();

const schema = {
  amount: computed(() =>
    !rowEmpty.value
      ? amountSchema(t("Moneyflow.validation.amount"))
      : any().optional(),
  ),
  comment: computed(() =>
    !rowEmpty.value
      ? string(globErr(t("Moneyflow.validation.comment"))).min(1)
      : string().optional(),
  ),
  postingAccountId: computed(() =>
    !rowEmpty.value
      ? number(globErr(t("Moneyflow.validation.postingAccountId"))).gt(0)
      : number().optional(),
  ),
};

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
  idSuffix: {
    type: String,
    default: "",
  },
});

const showRemainder = computed(() => {
  return props.isLastRow && props.remainder != 0;
});

const rowEmpty = computed(() => {
  return !mseAmount.value && !mseComment.value && !msePostingAccountId.value;
});

const remainderErrorData = computed(() => {
  return generateErrorData(
    props.remainderIsValid,
    t("Moneyflow.remainder"),
    t("Moneyflow.validation.remainder"),
  );
});

watch(
  () => props.amount,
  (newVal, oldVal) => {
    // we want to display an empty amount field when 0 is the amount!
    if (newVal === 0) mseAmount.value = undefined;
    else if (newVal !== oldVal) mseAmount.value = newVal;
  },
  { immediate: true },
);

watch(
  () => props.comment,
  (newVal, oldVal) => {
    if (newVal != oldVal) mseComment.value = newVal;
  },
  { immediate: true },
);
watch(
  () => props.postingAccountId,
  (newVal, oldVal) => {
    if (newVal != oldVal) msePostingAccountId.value = newVal ? newVal : 0;
  },
  { immediate: true },
);

watch(mseAmount, (newVal, oldVal) => {
  if (newVal != oldVal) amountChanged();
});
watch(mseComment, (newVal, oldVal) => {
  if (newVal != oldVal) commentChanged();
});
watch(msePostingAccountId, (newVal, oldVal) => {
  if (newVal != oldVal) postingaccountChanged();
});

const deleteMoneyflowSplitEntryRow = () => {
  emit("deleteMoneyflowSplitEntryRow", props.index);
};
const addMoneyflowSplitEntryRow = () => {
  emit("addMoneyflowSplitEntryRow");
};

const amountChanged = () => {
  let amount = mseAmount.value;

  // when amount is empty, we must send 0, otherwise force it to be a number
  amount = amount ? +amount : 0;
  emit("amountChanged", props.index, amount);
  if (props.isLastRow && mseAmount.value) addMoneyflowSplitEntryRow();
};

const commentChanged = () => {
  emit("commentChanged", props.index, mseComment.value);
  if (props.isLastRow && mseComment.value) addMoneyflowSplitEntryRow();
};

const postingaccountChanged = () => {
  emit(
    "postingAccountIdChanged",
    props.index,
    msePostingAccountId.value,
    msePostingAccountName.value,
  );
  if (props.isLastRow && msePostingAccountId.value) addMoneyflowSplitEntryRow();
};

const useRemainder = () => {
  mseAmount.value = props.remainder;

  if (props.moneyflowComment) {
    mseComment.value = props.moneyflowComment;
  }

  if (props.moneyflowPostingAccountId) {
    msePostingAccountId.value = props.moneyflowPostingAccountId;
  }
};
</script>
