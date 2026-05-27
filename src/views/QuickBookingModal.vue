<template>
  <Modal
    :title="preDef.contractpartnerName || $t('Moneyflow.newBooking')"
    ref="modalComponent"
    max-width="md:max-w-md w-full"
  >
    <template #body>
      <div class="space-y-3 pt-0">
        <div
          class="flex items-center gap-1 text-[11px] text-muted-foreground font-bold uppercase tracking-wider px-1 mb-2"
        >
          <CreditCard
            class="icon-extra-small shrink-0 text-muted-foreground/80"
            :title="$t('General.capitalsource')"
          />
          {{ preDef.capitalsourceComment }}
        </div>

        <!-- Eingabefelder -->
        <div class="grid grid-cols-3 gap-3">
          <InputStandard
            v-model="amount"
            id="quickBookingAmount"
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
            :field-label="$t('General.comment')"
          >
            <template #icon><MessageSquareMore class="icon-medium" /></template>
          </InputStandard>

          <SelectPostingAccount
            v-model="postingAccountId"
            id-suffix="quickBooking"
            :field-label="$t('General.postingAccount')"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <Button class="w-full px-8"> Buchen </Button>
    </template>
  </Modal>
</template>

<script lang="ts" setup>
import InputDate from "@/components/common/InputDate.vue";
import InputStandard from "@/components/common/InputStandard.vue";
import Modal from "@/components/common/Modal.vue";
import SelectPostingAccount from "@/components/postingaccount/SelectPostingAccount.vue";
import { Button } from "@/components/ui/button";
import { type PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Euro,
  MessageSquareMore,
} from "lucide-vue-next";
import { ref, useTemplateRef } from "vue";

const modalComponent = useTemplateRef<typeof Modal>("modalComponent");
const preDef = ref({} as PreDefMoneyflow);

const amount = ref<number>();
const comment = ref("");
const bookingDate = ref(new Date());
const postingAccountId = ref(0);

const changeDate = (days: number) => {
  const newDate = new Date(bookingDate.value);
  newDate.setDate(newDate.getDate() + days);
  bookingDate.value = newDate;
};

const _show = (flow: PreDefMoneyflow) => {
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
