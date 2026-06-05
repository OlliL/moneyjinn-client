<template>
  <ModalVue
    :title="$t('General.moneyflow')"
    id-suffix="ListMoneyflowMobile"
    :max-width="modalWidth"
    v-if="mmf"
    v-model:open="open"
  >
    <template #body>
      <DivError :server-errors="serverErrors" />

      <div class="w-full space-y-4 p-1 text-left">
        <div v-if="mmf.hasReceipt || receipt?.receipt">
          <div
            @click="showReceipt"
            class="flex items-center justify-between p-3 rounded-xl border border-dashed border-input bg-muted/40 hover:bg-muted/80 active:bg-muted transition-all cursor-pointer w-full group select-none mb-4"
          >
            <div class="flex items-center gap-3">
              <div
                class="p-2 bg-primary/10 text-primary rounded-lg group-hover:bg-primary/20 transition-colors"
              >
                <ReceiptText class="h-5 w-5" />
              </div>

              <div class="flex flex-col text-left">
                <span
                  class="text-sm font-semibold tracking-tight text-foreground"
                >
                  {{ $t("Moneyflow.viewReceipt") }}
                </span>
                <span class="text-xs text-muted-foreground mt-0.5">
                  {{ $t("Moneyflow.viewReceiptTip") }}
                </span>
              </div>
            </div>

            <div class="flex items-center pr-1">
              <Eye
                class="h-5 w-5 text-muted-foreground/60 group-hover:text-primary transition-colors"
              />
            </div>
          </div>
        </div>

        <div
          class="flex justify-between items-start pb-2 border-b border-border/40"
        >
          <div class="space-y-0.5">
            <div class="flex items-center gap-1 min-w-0 truncate">
              <Handshake
                class="icon-small shrink-0 text-foreground/80"
                :title="$t('General.contractpartner')"
              />
              <h3 class="text-base font-bold text-foreground tracking-tight">
                {{ mmf.contractpartnerName }}
              </h3>
            </div>

            <div class="flex items-center gap-1.5 min-w-0 truncate">
              <MessageSquareMore
                class="icon-extra-small shrink-0 text-muted-foreground/80"
                :title="$t('General.comment')"
              />
              <p v-if="mmf.comment" class="text-xs text-muted-foreground">
                {{ mmf.comment }}
              </p>
            </div>
          </div>
          <span class="text-lg font-bold">
            <SpanAmount :amount="mmf.amount" />
          </span>
        </div>

        <div class="divide-y divide-border/40 text-xs text-muted-foreground">
          <div class="grid grid-cols-[auto_1fr] items-center gap-3 py-2.5">
            <div class="flex items-center gap-1 w-32 shrink-0">
              <Calendar
                class="icon-extra-small text-muted-foreground/60 shrink-0"
              />
              <span>{{ $t("Moneyflow.bookingdate") }}</span>
            </div>
            <strong class="text-foreground font-semibold pl-2 truncate">
              <SpanDate :date="mmf.bookingDate" />
            </strong>
          </div>

          <div class="grid grid-cols-[auto_1fr] items-center gap-3 py-2.5">
            <div class="flex items-center gap-1 w-32 shrink-0">
              <CalendarDays
                class="icon-extra-small text-muted-foreground/60 shrink-0"
              />
              <span>{{ $t("Moneyflow.invoicedate") }}</span>
            </div>
            <strong class="text-foreground font-semibold pl-2 truncate">
              <SpanDate :date="mmf.invoiceDate" />
            </strong>
          </div>

          <div
            v-if="rowspan === 1"
            class="grid grid-cols-[auto_1fr] items-center gap-3 py-2.5"
          >
            <div class="flex items-center gap-1 w-32 shrink-0">
              <Tag class="icon-extra-small text-muted-foreground/60 shrink-0" />
              <span>{{ $t("General.postingAccount") }}</span>
            </div>
            <strong class="text-foreground font-semibold pl-2 truncate">
              {{ mmf.postingAccountName }}
            </strong>
          </div>

          <div class="grid grid-cols-[auto_1fr] items-center gap-3 py-2.5">
            <div class="flex items-center gap-1 w-32 shrink-0">
              <CreditCard
                class="icon-extra-small text-muted-foreground/60 shrink-0"
              />
              <span>{{ $t("General.capitalsource") }}</span>
            </div>
            <strong class="text-foreground font-semibold pl-2 truncate">
              {{ mmf.capitalsourceComment }}
            </strong>
          </div>
        </div>

        <div v-if="rowspan > 1" class="space-y-3 pt-2">
          <div class="flex items-center gap-2">
            <h4
              class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80"
            >
              {{ $t("Moneyflow.subbookings") }}
            </h4>
            <Badge
              variant="secondary"
              class="h-4.5 px-1.5 text-[10px] font-bold rounded-full bg-muted text-muted-foreground border-none"
            >
              {{ rowspan }}
            </Badge>
          </div>

          <div
            v-if="mmf.moneyflowSplitEntries?.length"
            class="pl-3 border-l-2 border-primary/30 space-y-1.5 pt-0.5"
          >
            <div
              class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-1"
            >
              {{ $t("Moneyflow.subbookings") }}
            </div>
            <div
              v-for="mse in mmf.moneyflowSplitEntries"
              :key="mse.id"
              class="flex justify-between items-start text-xs bg-muted/20 p-2 rounded gap-2"
            >
              <div class="flex flex-col min-w-0 text-left">
                <div class="flex items-center gap-1 min-w-0 truncate">
                  <MessageSquareMore
                    class="icon-extra-small shrink-0 text-muted-foreground/80"
                    :title="$t('General.comment')"
                  />
                  <span class="font-medium text-foreground text-xs truncate">{{
                    mse.comment
                  }}</span>
                </div>
                <div class="flex items-center gap-1 min-w-0 truncate">
                  <Tag
                    class="icon-extra-small shrink-0 text-muted-foreground/80"
                    :title="$t('General.postingAccount')"
                  />
                  <span class="text-xs-muted truncate">{{
                    mse.postingAccountName
                  }}</span>
                </div>
              </div>
              <span
                class="font-semibold text-[11px] shrink-0 text-muted-foreground"
              >
                <SpanAmount :amount="mse.amount" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, ref, toRaw, watch } from "vue";
import useListMoneyflowModalStore from "./ListMoneyflowModal.store";

// shadcn/ui Komponenten
import { Badge } from "@/components/ui/badge";

// Icons aus lucide-vue-next (Neu: Calendar und CalendarDays hinzugefügt)
import {
  Calendar,
  CalendarDays,
  CreditCard,
  Eye,
  Handshake,
  MessageSquareMore,
  ReceiptText,
  Tag,
} from "lucide-vue-next";

// Eigene bestehende Komponenten & Typen
import type { ImportedMoneyflowReceipt } from "@/model/moneyflow/ImportedMoneyflowReceipt";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import DivError from "../common/DivError.vue";
import ModalVue from "../common/Modal.vue";
import SpanAmount from "../common/SpanAmount.vue";
import SpanDate from "../common/SpanDate.vue";

const serverErrors = ref(new Array<string>());
const mmf = ref({} as Moneyflow);
const { open, moneyflow, importedReceipt, onShowReceipt } = storeToRefs(
  useListMoneyflowModalStore(),
);

// Schmaleres, fokussiertes Layout für Mobile & Desktop-Details
const modalWidth = computed(() => "md:max-w-md w-full mx-auto");

const rowspan = computed(() => {
  if (mmf.value.moneyflowSplitEntries != null) {
    return mmf.value.moneyflowSplitEntries.length;
  }
  return 1;
});

const receipt = ref({} as undefined | ImportedMoneyflowReceipt);

watch(
  [open, moneyflow, importedReceipt],
  ([isVisible, entry, importedReceipt]) => {
    if (!isVisible || !entry) return;

    mmf.value = structuredClone(toRaw(entry));
    receipt.value = importedReceipt;
    serverErrors.value = new Array<string>();
  },
  { immediate: true },
);

const showReceipt = () => {
  onShowReceipt.value?.(mmf.value.id);
};
</script>
