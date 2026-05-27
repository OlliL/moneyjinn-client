<template>
  <Modal
    :title="$t('Moneyflow.newBooking')"
    ref="modalComponent"
    max-width="md:max-w-md w-full"
  >
    <template #body>
      <div class="space-y-6 pt-2">
        <!-- Info-Bereich (Vertragspartner & Kapitalquelle) -->
        <div class="bg-muted/30 p-3 rounded-lg border space-y-2">
          <div class="flex items-center gap-2 text-foreground">
            <Handshake class="icon-small shrink-0" />
            <span class="font-bold text-sm truncate">{{
              preDef.contractpartnerName
            }}</span>
          </div>
          <div class="flex items-center gap-2 text-muted-foreground text-xs">
            <CreditCard class="icon-extra-small shrink-0" />
            <span class="truncate">{{ preDef.capitalsourceComment }}</span>
          </div>
        </div>

        <!-- Eingabefelder -->
        <div class="space-y-4">
          <InputDate
            v-model="bookingDate"
            id="quickBookingDate"
            :field-label="$t('Moneyflow.bookingdate')"
          />

          <InputStandard
            v-model="amount"
            id="quickBookingAmount"
            field-type="number"
            step="0.01"
            :field-label="$t('General.amount')"
          >
            <template #icon><Euro class="icon-medium" /></template>
          </InputStandard>

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
      <Button class="w-full md:w-auto px-8"> Buchen </Button>
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
  CreditCard,
  Euro,
  Handshake,
  MessageSquareMore,
} from "lucide-vue-next";
import { ref, useTemplateRef } from "vue";

const modalComponent = useTemplateRef<typeof Modal>("modalComponent");
const preDef = ref({} as PreDefMoneyflow);

const amount = ref<number>();
const comment = ref("");
const bookingDate = ref(new Date());
const postingAccountId = ref(0);

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
