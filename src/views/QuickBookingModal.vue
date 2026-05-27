<template>
  <Modal
    :title="preDef.contractpartnerName || $t('Moneyflow.newBooking')"
    ref="modalComponent"
    max-width="md:max-w-md w-full"
  >
    <template #body>
      <form
        @submit.prevent="book"
        :id="'quickBookingForm'"
        class="flex flex-col h-full"
      >
        <div class="space-y-3 pt-0">
          <DivError :server-errors="serverErrors" />

          <div
            class="flex items-center justify-between text-[11px] text-muted-foreground font-bold uppercase tracking-wider px-1 mb-2 gap-2"
          >
            <div class="flex items-center gap-1 min-w-0 flex-1">
              <CreditCard
                class="icon-extra-small shrink-0 text-muted-foreground/80"
                :title="$t('General.capitalsource')"
              />
              <span class="truncate">{{ preDef.capitalsourceComment }}</span>
            </div>
            <div v-if="preDef.lastUsed" class="shrink-0 whitespace-nowrap">
              {{ $t("PreDefMoneyflow.lastUsedShort") }}:
              <SpanDate :date="preDef.lastUsed" />
            </div>
          </div>

          <!-- Eingabefelder -->
          <div class="grid grid-cols-3 gap-3">
            <InputStandard
              v-model="amount"
              id="quickBookingAmount"
              :validation-schema="schema.amount"
              field-type="number"
              step="0.01"
              :field-label="$t('General.amount')"
            >
              <template #icon><Euro class="icon-medium" /></template>
            </InputStandard>

            <div class="flex items-end gap-0.5 col-span-2">
              <InputDate
                v-model="bookingDate"
                id="quickBookingDate"
                :validation-schema="schema.bookingDate"
                :field-label="$t('Moneyflow.bookingdate')"
                class="flex-1 min-w-0"
              />
              <Button
                variant="ghost"
                size="icon"
                class="h-9 w-8 shrink-0 mb-0.5"
                @click="changeDate(-1)"
              >
                <ChevronLeft class="icon-medium" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                class="h-9 w-8 shrink-0 mb-0.5"
                @click="changeDate(1)"
              >
                <ChevronRight class="icon-medium" />
              </Button>
            </div>
          </div>

          <div class="space-y-3">
            <InputStandard
              v-model="comment"
              id="quickBookingComment"
              :validation-schema="schema.comment"
              :field-label="$t('General.comment')"
            >
              <template #icon
                ><MessageSquareMore class="icon-medium"
              /></template>
            </InputStandard>

            <SelectPostingAccount
              v-model="postingAccountId"
              id-suffix="quickBooking"
              :validation-schema="schema.postingAccountId"
              :field-label="$t('General.postingAccount')"
            />
          </div>
        </div>
      </form>
    </template>

    <template #footer>
      <ButtonSubmit
        :button-label="$t('General.save')"
        :form-id="'quickBookingForm'"
        class="w-full md:w-auto px-8"
      >
        <template #icon><Save class="icon-medium" /></template>
      </ButtonSubmit>
    </template>
  </Modal>
</template>

<script lang="ts" setup>
import ButtonSubmit from "@/components/common/ButtonSubmit.vue";
import DivError from "@/components/common/DivError.vue";
import InputDate from "@/components/common/InputDate.vue";
import InputStandard from "@/components/common/InputStandard.vue";
import Modal from "@/components/common/Modal.vue";
import SpanDate from "@/components/common/SpanDate.vue";
import SelectPostingAccount from "@/components/postingaccount/SelectPostingAccount.vue";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { type PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import MoneyflowService from "@/service/MoneyflowService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { amountSchema, globErr } from "@/tools/views/ZodUtil";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Euro,
  MessageSquareMore,
  Save,
} from "lucide-vue-next";
import { useForm } from "vee-validate";
import { ref, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import { date, number, string } from "zod";

const { t } = useI18n();
const { handleSubmit } = useForm();

const emit = defineEmits(["bookingFinished"]);

const modalComponent = useTemplateRef<typeof Modal>("modalComponent");
const preDef = ref({} as PreDefMoneyflow);
const serverErrors = ref(new Array<string>());

const amount = ref<number>();
const comment = ref("");
const bookingDate = ref(new Date());
const postingAccountId = ref(0);

const schema = {
  amount: amountSchema(t("Moneyflow.validation.amount")),
  bookingDate: date(globErr(t("Moneyflow.validation.bookingDate"))),
  comment: string(globErr(t("Moneyflow.validation.comment")))
    .min(1)
    .max(100, t("Moneyflow.validation.length.comment")),
  postingAccountId: number(
    globErr(t("Moneyflow.validation.postingAccountId")),
  ).gt(0),
};

const changeDate = (days: number) => {
  const newDate = new Date(bookingDate.value);
  newDate.setDate(newDate.getDate() + days);
  bookingDate.value = newDate;
};

const book = handleSubmit(() => {
  serverErrors.value = new Array<string>();

  const mmf: Moneyflow = {
    amount: amount.value!,
    bookingDate: bookingDate.value,
    comment: comment.value,
    postingAccountId: postingAccountId.value,
    contractpartnerId: preDef.value.contractpartnerId,
    capitalsourceId: preDef.value.capitalsourceId,
    private: false,
  } as Moneyflow;

  MoneyflowService.createMoneyflow(mmf, preDef.value.id, false)
    .then(() => {
      emit("bookingFinished", mmf);
      modalComponent.value?._hide();
    })
    .catch((error) => handleBackendError(error, serverErrors));
});

const _show = (flow: PreDefMoneyflow) => {
  serverErrors.value = new Array<string>();
  preDef.value = flow;

  amount.value = flow.amount;
  comment.value = flow.comment;
  postingAccountId.value = flow.postingAccountId;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  bookingDate.value = today;

  modalComponent.value?._show();
};

defineExpose({ _show });
</script>
