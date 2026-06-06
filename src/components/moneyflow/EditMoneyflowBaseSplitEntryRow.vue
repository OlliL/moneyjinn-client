<template>
  <div
    class="grid grid-cols-1 md:grid-cols-12 gap-3 items-start py-2 border-b last:border-0 border-muted/50 group"
    data-testid="splitEntryRow"
  >
    <div class="md:col-span-2 flex items-end gap-2">
      <Button
        id="delete-button"
        type="button"
        variant="ghost"
        size="icon"
        class="h-10 w-10 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        @click="deleteMoneyflowSplitEntryRow"
        :data-testid="'splitEntryRowDeleteButton' + idSuffix"
      >
        <Trash2 class="icon-medium" />
      </Button>

      <div class="flex-1 w-full">
        <InputStandard
          v-model="mseAmount"
          :validation-schema-ref="schema.amount"
          :id="'amountSplitEntry' + idSuffix"
          field-type="number"
          step="0.01"
          :field-label="$t('General.amount')"
        >
          <template #icon>
            <Euro class="icon-medium" />
          </template>
        </InputStandard>
      </div>
    </div>

    <div class="md:col-span-5">
      <InputStandard
        v-model="mseComment"
        :validation-schema-ref="schema.comment"
        :id="'commentSplitEntry' + idSuffix"
        :field-label="$t('General.comment')"
        name="comment"
      >
        <template #icon><MessageSquareMore class="icon-medium" /></template>
      </InputStandard>
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
            data-testid="remainderButton"
          >
            <ArrowLeft />
          </div>

          <Input
            disabled
            :model-value="remainder.toFixed(2)"
            id="remainder-input"
            data-testid="remainder"
            :class="[
              'rounded-l-none',
              isRemainderInvalid
                ? '!border-destructive bg-destructive/[0.03] focus-visible:ring-destructive/15'
                : '',
            ]"
          />
        </div>
        <p
          v-if="isRemainderInvalid"
          class="text-[0.8rem] font-medium text-destructive mt-0.5 text-left ml-1"
        >
          {{ $t("Moneyflow.validation.remainder") }}
        </p>
      </div>
    </div>

    <Separator class="block md:hidden my-2 bg-muted-foreground/30" />
  </div>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { amountSchema, globErr } from "@/tools/views/ZodUtil";
import { ArrowLeft, Euro, MessageSquareMore, Trash2 } from "lucide-vue-next";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { any, number, string } from "zod";
import InputStandard from "../common/InputStandard.vue";
import SelectPostingAccount from "../postingaccount/SelectPostingAccount.vue";
import { Separator } from "../ui/separator";

const { t } = useI18n();

const schema = {
  amount: computed(() =>
    rowEmpty.value
      ? any().optional()
      : amountSchema(t("Moneyflow.validation.amount")),
  ),
  comment: computed(() =>
    rowEmpty.value
      ? string().optional()
      : string(globErr(t("Moneyflow.validation.comment")))
          .min(1)
          .max(100, t("Moneyflow.validation.length.comment")),
  ),
  postingAccountId: computed(() =>
    rowEmpty.value
      ? number().optional()
      : number(globErr(t("Moneyflow.validation.postingAccountId"))).gt(0),
  ),
};

const mseAmount = ref(undefined as number | undefined);
const mseComment = ref("");
const msePostingAccountId = ref(0);
const msePostingAccountName = ref(undefined as string | undefined);

const emit = defineEmits<{
  deleteMoneyflowSplitEntryRow: [index: number];
  addMoneyflowSplitEntryRow: [];
  amountChanged: [index: number, amount: number];
  commentChanged: [index: number, comment: string];
  postingAccountIdChanged: [
    index: number,
    postingAccountId: number,
    postingAccountName: string,
  ];
}>();

const props = withDefaults(
  defineProps<{
    amount?: number;
    comment?: string;
    postingAccountId?: number;
    isLastRow: boolean;
    index: number;
    remainder: number;
    remainderIsValid?: boolean;
    moneyflowComment?: string;
    moneyflowPostingAccountId?: number;
    idSuffix?: string;
  }>(),
  {
    idSuffix: "",
  },
);

const showRemainder = computed(() => props.isLastRow && props.remainder != 0);
const rowEmpty = computed(
  () => !mseAmount.value && !mseComment.value && !msePostingAccountId.value,
);

const isRemainderInvalid = computed(() => props.remainderIsValid === false);

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
  (newVal) => {
    mseComment.value = newVal ?? "";
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
  const amount = mseAmount.value ? +mseAmount.value : 0;
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
    msePostingAccountName.value ?? "",
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
