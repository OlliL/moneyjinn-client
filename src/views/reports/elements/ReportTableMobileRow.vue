<template>
  <AccordionItem
    :value="'item-' + mmf.id"
    :data-testid="`report-mobile-moneyflow-row-${mmf.id}`"
    class="border rounded-lg bg-background shadow-sm px-3 py-1"
    :class="{
      'border-destructive/30 bg-destructive/5': mmf.private,
    }"
  >
    <AccordionTrigger class="hover:no-underline w-full min-w-0">
      <div class="grid grid-cols-[1fr_auto] items-center w-full gap-2">
        <div class="flex flex-col items-start text-left overflow-hidden">
          <div
            class="flex items-center gap-1.5 text-xs text-muted-foreground font-normal truncate w-full"
          >
            <div
              class="flex items-center gap-1.5 truncate transition-opacity"
              :class="lesserOpacityIfFuture"
            >
              <Calendar
                class="icon-extra-small text-muted-foreground/60 shrink-0"
              />
              <SpanDate :date="mmf.bookingDate" />

              <span
                v-if="mmf.private"
                class="bg-destructive/20 text-destructive px-1 rounded text-[10px]"
              >
                {{ $t("Moneyflow.private") }}
              </span>
              <span
                v-if="mmf.moneyflowSplitEntries?.length"
                class="bg-primary/20 text-primary px-1 rounded text-[10px]"
              >
                {{ $t("Moneyflow.subbookings") }}
              </span>
            </div>
            <span
              v-if="isFuture"
              class="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-1 rounded text-[10px] font-medium"
            >
              {{ $t("Moneyflow.reserved") }}
            </span>
          </div>

          <div
            v-if="!hideContractpartner"
            class="flex items-center gap-1 min-w-0 truncate transition-opacity"
            :class="lesserOpacityIfFuture"
          >
            <Handshake
              class="icon-small shrink-0 text-foreground/80"
              :title="$t('General.contractpartner')"
            />
            <span class="font-bold text-base text-foreground truncate w-full">{{
              mmf.contractpartnerName
            }}</span>
          </div>
        </div>

        <div
          class="flex flex-col items-end gap-1.5 shrink-0 text-right transition-opacity"
          :class="lesserOpacityIfFuture"
        >
          <span
            class="font-extrabold text-sm text-foreground"
            :class="{
              'border-b border-double border-foreground':
                mmf.moneyflowSplitEntries?.length,
            }"
          >
            <SpanAmount :amount="mmf.amount" />
          </span>

          <div class="flex gap-0.5">
            <Button
              v-if="mmf.hasReceipt"
              :data-testid="`report-mobile-moneyflow-receipt-${mmf.id}`"
              variant="ghost"
              size="icon"
              class="h-7 w-7"
              @click.stop="$emit('showReceipt', mmf.id)"
            >
              <ReceiptText class="icon-small" />
            </Button>
            <Button
              v-if="isOwnMoneyflow"
              :data-testid="`report-mobile-moneyflow-edit-${mmf.id}`"
              variant="ghost"
              size="icon"
              class="h-7 w-7"
              @click.stop="$emit('editMoneyflow', mmf)"
            >
              <Pencil class="icon-small" />
            </Button>
            <Button
              v-if="isOwnMoneyflow"
              :data-testid="`report-mobile-moneyflow-delete-${mmf.id}`"
              variant="ghost"
              size="icon"
              class="h-7 w-7 text-destructive"
              @click.stop="$emit('deleteMoneyflow', mmf)"
            >
              <Trash2 class="icon-small" />
            </Button>
            <Button
              v-if="!isOwnMoneyflow"
              :data-testid="`report-mobile-moneyflow-list-${mmf.id}`"
              variant="ghost"
              size="icon"
              class="h-7 w-7"
              @click.stop="$emit('listMoneyflow', mmf)"
            >
              <Eye class="icon-small" />
            </Button>
          </div>
        </div>
      </div>
    </AccordionTrigger>

    <AccordionContent
      class="pt-3 pb-1 space-y-2 border-t mt-2 transition-opacity"
      :class="lesserOpacityIfFuture"
    >
      <div
        class="text-xs text-muted-foreground bg-muted/40 p-2 rounded space-y-2"
      >
        <div
          class="flex items-center gap-1.5 break-all w-full"
          v-if="!mmf.moneyflowSplitEntries?.length && !showCommentInTrigger"
        >
          <MessageSquareMore
            class="icon-extra-small shrink-0 text-foreground"
            :title="$t('General.comment')"
          />
          <span class="text-foreground">{{ mmf.comment }}</span>
        </div>

        <div
          class="grid grid-cols-2 gap-2 text-xs text-muted-foreground/80 pt-0.5 border-t border-muted/60 mt-1"
        >
          <div class="flex items-center gap-1 min-w-0 truncate">
            <CreditCard
              class="icon-extra-small shrink-0 text-muted-foreground/80"
              :title="$t('General.capitalsource')"
            />
            {{ mmf.capitalsourceComment }}
          </div>
          <div
            v-if="mmf.postingAccountName && !mmf.moneyflowSplitEntries?.length"
            class="flex items-center gap-1 min-w-0 truncate"
          >
            <Tag
              class="icon-extra-small shrink-0 text-muted-foreground/80"
              :title="$t('General.postingAccount')"
            />
            {{ mmf.postingAccountName }}
          </div>
        </div>
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
    </AccordionContent>
  </AccordionItem>
</template>

<script lang="ts" setup>
import SpanAmount from "@/components/common/SpanAmount.vue";
import SpanDate from "@/components/common/SpanDate.vue";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import {
  Calendar,
  CreditCard,
  Eye,
  Handshake,
  MessageSquareMore,
  Pencil,
  ReceiptText,
  Tag,
  Trash2,
} from "lucide-vue-next";
import { computed, type PropType } from "vue";

const props = defineProps({
  mmf: { type: Object as PropType<Moneyflow>, required: true },
  hideContractpartner: { type: Boolean, default: false },
  showCommentInTrigger: { type: Boolean, default: false },
});

defineEmits<{
  showReceipt: [id: number];
  editMoneyflow: [moneyflow: Moneyflow];
  deleteMoneyflow: [moneyflow: Moneyflow];
  listMoneyflow: [moneyflow: Moneyflow];
}>();

const userSessionStore = useUserSessionStore();
const today = new Date();
today.setHours(0, 0, 0, 0);

const isOwnMoneyflow = computed(
  () => props.mmf.userId === userSessionStore.getUserId,
);

const isFuture = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const bookingDate = new Date(props.mmf.bookingDate);
  bookingDate.setHours(0, 0, 0, 0);
  return bookingDate > today;
});

const lesserOpacityIfFuture = computed(() =>
  isFuture.value ? "opacity-50" : "",
);
</script>
