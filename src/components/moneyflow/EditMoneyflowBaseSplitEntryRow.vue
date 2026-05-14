<template>
  <div
    class="grid grid-cols-1 md:grid-cols-12 gap-3 items-start py-2 border-b last:border-0 border-muted/50 group"
    data-testid="splitEntryRow"
  >
    <div class="md:col-span-1 grid">
      <div class="grid w-full gap-1.5 relative">
        <span class="h-[0.75rem] invisible">Placeholder</span>

        <div class="flex justify-center h-10 items-center">
          <div class="grid grid-cols-2 gap-1 w-16">
            <Button
              id="delete-button"
              type="button"
              variant="outline"
              size="icon"
              class="h-8 w-8 text-destructive hover:bg-destructive/10"
              @click="deleteMoneyflowSplitEntryRow"
              :data-testid="'splitEntryRowDeleteButton' + idSuffix"
            >
              <Minus class="h-4 w-4" />
            </Button>

            <Button
              v-if="isLastRow"
              type="button"
              variant="outline"
              size="icon"
              class="h-8 w-8 text-primary hover:bg-primary/10"
              @click="addMoneyflowSplitEntryRow"
              :data-testid="'splitEntryRowAddButton' + idSuffix"
            >
              <Plus class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>

    <div class="md:col-span-2">
      <InputStandard
        v-model="mseAmount"
        :validation-schema-ref="schema.amount"
        :id="'amountSplitEntry' + idSuffix"
        field-type="number"
        step="0.01"
        :field-label="$t('General.amount')"
      >
        <template #icon>
          <Euro class="h-4 w-4 text-muted-foreground" />
        </template>
      </InputStandard>
    </div>

    <div class="md:col-span-4">
      <InputStandard
        v-model="mseComment"
        :validation-schema-ref="schema.comment"
        :id="'commentSplitEntry' + idSuffix"
        :field-label="$t('General.comment')"
        name="comment"
      />
    </div>

    <div class="md:col-span-3">
      <SelectPostingAccount
        v-model="msePostingAccountId"
        :validation-schema-ref="schema.postingAccountId"
        :field-label="$t('General.postingAccount')"
        :id-suffix="'SplitEntry' + idSuffix"
      />
    </div>

    <div class="md:col-span-2" v-if="showRemainder">
      <div class="grid w-full gap-1.5 relative">
        <Label for="remainder-input" class="text-left ml-1">
          {{ $t("Moneyflow.remainder") }}
        </Label>

        <div class="flex -space-x-px relative">
          <div
            class="flex items-center justify-center px-2 border border-input rounded-l-md text-foreground transition-colors relative cursor-pointer"
            @click="useRemainder"
          >
            <ArrowLeft />
          </div>

          <Input
            disabled
            :model-value="remainder.toFixed(2)"
            id="remainder-input"
            :class="[
              'rounded-l-none',
              remainderErrorData.inputClass == 'is-invalid'
                ? '!border-destructive bg-destructive/[0.03] focus-visible:ring-destructive/15'
                : '',
            ]"
            class=""
          />
        </div>
        <p
          v-if="remainderErrorData.inputClass == 'is-invalid'"
          class="text-[0.8rem] font-medium text-destructive mt-0.5 text-left ml-1"
        >
          {{ remainderErrorData.fieldLabel }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { Minus, Plus, Euro, ArrowLeft } from "lucide-vue-next";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { generateErrorData } from "@/tools/views/ErrorData";
import { amountSchema, globErr } from "@/tools/views/ZodUtil";
import { any, number, string } from "zod";

import InputStandard from "../InputStandard.vue";
import SelectPostingAccount from "../postingaccount/SelectPostingAccount.vue";

const { t } = useI18n();

// ... (Logik bleibt identisch zum Original)
const schema = {
  amount: computed(() =>
    !rowEmpty.value
      ? amountSchema(t("Moneyflow.validation.amount"))
      : any().optional(),
  ),
  comment: computed(() =>
    !rowEmpty.value
      ? string(globErr(t("Moneyflow.validation.comment")))
          .min(1)
          .max(100, t("Moneyflow.validation.length.comment"))
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
  amount: { type: Number, required: false },
  comment: { type: String, required: false },
  postingAccountId: { type: Number, required: false },
  isLastRow: { type: Boolean, required: true },
  index: { type: Number, required: true },
  remainder: { type: Number, required: true },
  remainderIsValid: { type: Boolean, required: false },
  moneyflowComment: { type: String, required: false },
  moneyflowPostingAccountId: { type: Number, required: false },
  idSuffix: { type: String, default: "" },
});

const showRemainder = computed(() => props.isLastRow && props.remainder != 0);
const rowEmpty = computed(
  () => !mseAmount.value && !mseComment.value && !msePostingAccountId.value,
);

const remainderErrorData = computed(() =>
  generateErrorData(
    props.remainderIsValid,
    t("Moneyflow.remainder"),
    t("Moneyflow.validation.remainder"),
  ),
);

// Watcher für Initialisierung und Änderungen
watch(
  () => props.amount,
  (newVal, oldVal) => {
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
    if (newVal != oldVal) msePostingAccountId.value = newVal ?? 0;
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

const deleteMoneyflowSplitEntryRow = () =>
  emit("deleteMoneyflowSplitEntryRow", props.index);
const addMoneyflowSplitEntryRow = () => emit("addMoneyflowSplitEntryRow");

const amountChanged = () => {
  let amount = mseAmount.value ? +mseAmount.value : 0;
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
  if (props.moneyflowComment) mseComment.value = props.moneyflowComment;
  if (props.moneyflowPostingAccountId)
    msePostingAccountId.value = props.moneyflowPostingAccountId;
};
</script>
