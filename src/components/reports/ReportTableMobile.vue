<template>
  <div class="fixed bottom-6 right-6 z-50 md:hidden">
    <Sheet v-model:open="isSheetOpen">
      <SheetTrigger as-child>
        <Button
          class="h-12 w-12 p-0 rounded-full shadow-lg flex items-center justify-center"
        >
          <Filter class="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        class="h-[75vh] rounded-t-xl p-6 flex flex-col"
      >
        <SheetHeader class="text-left pb-4 border-b shrink-0">
          <SheetTitle>{{ $t("Reports.filterData") }}</SheetTitle>
        </SheetHeader>

        <form
          @submit.prevent="handleEnter"
          @keydown.enter.prevent="handleEnter"
          class="flex-1 overflow-y-auto space-y-4 py-4 pb-8 px-0.5"
        >
          <InputStandard
            v-model="filterCapitalsource"
            id="report-table-mobile-filter-capitalsource"
            :field-label="t('General.capitalsource')"
            :placeholder="$t('General.enterFilter')"
            enterkeyhint="send"
          >
            <template #button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                @click="filterCapitalsource = ''"
                class="rounded-l-none border-l"
              >
                <X class="h-4 w-4" />
              </Button>
            </template>
          </InputStandard>

          <InputStandard
            v-model="filterContractpartner"
            id="report-table-mobile-filter-contractpartner"
            :field-label="t('General.contractpartner')"
            :placeholder="$t('General.enterFilter')"
            enterkeyhint="send"
          >
            <template #button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                @click="filterContractpartner = ''"
                class="rounded-l-none border-l"
              >
                <X class="h-4 w-4" />
              </Button>
            </template>
          </InputStandard>

          <InputStandard
            v-model="filterComment"
            id="report-table-mobile-filter-comment"
            :field-label="t('General.comment')"
            :placeholder="$t('General.enterFilter')"
            enterkeyhint="send"
          >
            <template #button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                @click="filterComment = ''"
                class="rounded-l-none border-l"
              >
                <X class="h-4 w-4" />
              </Button>
            </template>
          </InputStandard>

          <InputStandard
            v-model="filterPostingAccount"
            id="report-table-mobile-filter-postingAccount"
            :field-label="t('General.postingAccount')"
            :placeholder="$t('General.enterFilter')"
            enterkeyhint="send"
          >
            <template #button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                @click="filterPostingAccount = ''"
                class="rounded-l-none border-l"
              >
                <X class="h-4 w-4" />
              </Button>
            </template>
          </InputStandard>
        </form>
      </SheetContent>
    </Sheet>
  </div>

  <div class="md:hidden w-full max-w-md mx-auto px-2 mb-6 space-y-3">
    <div
      class="p-2 bg-muted/60 text-xs rounded-md text-center text-muted-foreground font-medium"
    >
      {{
        $t("Reports.howManyFlowsShownMessage", {
          num: filteredMoneyflows.length,
          all: moneyflowsCount || 0,
        })
      }}
    </div>

    <Accordion type="multiple" class="space-y-2">
      <AccordionItem
        v-for="mmf in filteredMoneyflows"
        :key="'mobile-' + mmf.id"
        :value="'item-' + mmf.id"
        class="border rounded-lg bg-background shadow-sm px-3 py-2 text-left relative overflow-hidden"
        :class="{ 'border-destructive/30 bg-destructive/5': mmf.private }"
      >
        <div
          class="grid grid-cols-[1fr_auto] gap-2 items-center min-h-[48px] relative"
        >
          <div class="flex flex-col gap-0.5 min-w-0">
            <div
              class="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap"
            >
              <SpanDate :date="mmf.bookingDate" />
              <span
                v-if="mmf.private"
                class="bg-destructive/20 text-destructive px-1 rounded text-[10px]"
                >Privat</span
              >
              <span
                v-if="mmf.moneyflowSplitEntries?.length"
                class="bg-primary/20 text-primary px-1 rounded text-[10px]"
                >{{ $t("Moneyflow.subbookings") }}</span
              >
            </div>
            <span class="font-bold text-sm text-foreground truncate">
              {{ mmf.contractpartnerName || "-" }}
            </span>
          </div>

          <div class="flex flex-col items-end gap-1 shrink-0 text-right z-10">
            <span
              class="font-extrabold text-sm"
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
                variant="ghost"
                size="icon"
                class="h-7 w-7"
                @click.stop="showReceipt(mmf.id)"
              >
                <ReceiptText class="h-3.5 w-3.5" />
              </Button>
              <Button
                v-if="mmf.userId === userSessionStore.getUserId"
                variant="ghost"
                size="icon"
                class="h-7 w-7"
                @click.stop="editMoneyflow(mmf)"
              >
                <Pencil class="h-3.5 w-3.5" />
              </Button>
              <Button
                v-if="mmf.userId === userSessionStore.getUserId"
                variant="ghost"
                size="icon"
                class="h-7 w-7 text-destructive"
                @click.stop="deleteMoneyflow(mmf)"
              >
                <Trash2 class="h-3.5 w-3.5" />
              </Button>
              <Button
                v-if="mmf.userId !== userSessionStore.getUserId"
                variant="ghost"
                size="icon"
                class="h-7 w-7"
                @click.stop="listMoneyflow(mmf)"
              >
                <Eye class="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <AccordionTrigger
            class="absolute inset-0 h-full w-full opacity-0 p-0 m-0 [&>svg]:hidden"
          />
        </div>

        <AccordionContent class="pt-3 pb-1 space-y-2 border-t mt-2">
          <div
            class="text-xs text-muted-foreground bg-muted/40 p-2 rounded space-y-2"
          >
            <div
              class="flex items-center gap-1.5 break-all w-full"
              v-if="!mmf.moneyflowSplitEntries?.length"
            >
              <MessageSquareMore
                class="h-4 w-4 shrink-0 text-muted-foreground/80"
                :title="$t('General.comment')"
              />
              <span class="text-foreground">{{ mmf.comment }}</span>
            </div>

            <div
              class="grid grid-cols-2 gap-2 text-xs text-muted-foreground/80 pt-0.5 border-t border-muted/60 mt-1"
            >
              <div class="flex items-center gap-1 min-w-0 truncate">
                <CreditCard
                  class="h-4 w-4 shrink-0 text-muted-foreground/80"
                  :title="$t('General.capitalsource')"
                />
                {{ mmf.capitalsourceComment }}
              </div>
              <div
                v-if="
                  mmf.postingAccountName && !mmf.moneyflowSplitEntries?.length
                "
                class="flex items-center gap-1 min-w-0 truncate"
              >
                <Tag
                  class="h-4 w-4 shrink-0 text-muted-foreground/80"
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
                    class="h-3 w-3 shrink-0 text-muted-foreground/80"
                    :title="$t('General.comment')"
                  />
                  <span class="font-medium text-foreground text-xs truncate">{{
                    mse.comment
                  }}</span>
                </div>
                <div class="flex items-center gap-1 min-w-0 truncate">
                  <Tag
                    class="h-3 w-3 shrink-0 text-muted-foreground/80"
                    :title="$t('General.postingAccount')"
                  />
                  <span class="text-muted-foreground text-xs truncate">{{
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
    </Accordion>

    <div
      class="p-4 border rounded-lg bg-muted/40 flex justify-between items-center text-sm font-bold shadow-sm"
    >
      <span>{{ $t("General.overallSums") }}</span>
      <span class="underline decoration-double text-base">
        <SpanAmount :amount="amountSum" />
      </span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import SpanAmount from "@/components/SpanAmount.vue";
import SpanDate from "@/components/SpanDate.vue";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import {
  CreditCard,
  Eye,
  Filter,
  MessageSquareMore,
  Pencil,
  ReceiptText,
  Tag,
  Trash2,
  X,
} from "lucide-vue-next";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import InputStandard from "../InputStandard.vue";

const { t } = useI18n();

const props = defineProps<{
  filteredMoneyflows: Moneyflow[];
  moneyflowsCount: number;
  amountSum: number;
}>();

const filterContractpartner = defineModel<string>("filterContractpartner", {
  default: "",
});
const filterComment = defineModel<string>("filterComment", { default: "" });
const filterPostingAccount = defineModel<string>("filterPostingAccount", {
  default: "",
});
const filterCapitalsource = defineModel<string>("filterCapitalsource", {
  default: "",
});
const emit = defineEmits<{
  showReceipt: [id: number];
  editMoneyflow: [moneyflow: Moneyflow];
  deleteMoneyflow: [moneyflow: Moneyflow];
  listMoneyflow: [moneyflow: Moneyflow];
}>();

const userSessionStore = useUserSessionStore();
const isSheetOpen = ref(false);

const showReceipt = (id: number) => {
  emit("showReceipt", id);
};

const editMoneyflow = (moneyflow: Moneyflow) => {
  emit("editMoneyflow", moneyflow);
};

const deleteMoneyflow = (moneyflow: Moneyflow) => {
  emit("deleteMoneyflow", moneyflow);
};

const listMoneyflow = (moneyflow: Moneyflow) => {
  emit("listMoneyflow", moneyflow);
};

const handleEnter = (event: Event): void => {
  event.preventDefault();
  event.stopPropagation();
  isSheetOpen.value = false;
};
</script>
