<template>
  <div class="fixed bottom-6 right-6 z-50 md:hidden">
    <Sheet v-model:open="isSheetOpen">
      <SheetTrigger as-child>
        <Button
          class="shadow-lg rounded-full h-12 w-12 p-0 flex items-center justify-center"
        >
          <Filter class="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" class="h-[75vh] rounded-t-xl p-6">
        <SheetHeader class="text-left pb-4 border-b">
          <SheetTitle>Daten filtern</SheetTitle>
        </SheetHeader>
        <form
          @submit.prevent="handleEnter"
          @keydown.enter.prevent="handleEnter"
        >
          <div
            class="py-4 space-y-4 overflow-y-auto h-[calc(75vh-120px)] pb-12"
          >
            <div class="space-y-1.5 flex items-center">
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
                    ><X class="h-4 w-4"
                  /></Button>
                </template>
              </InputStandard>
            </div>
            <div class="space-y-1.5 flex items-center">
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
                    ><X class="h-4 w-4"
                  /></Button>
                </template>
              </InputStandard>
            </div>
            <div class="space-y-1.5 flex items-center">
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
                    ><X class="h-4 w-4"
                  /></Button>
                </template>
              </InputStandard>
            </div>
            <div class="space-y-1.5 flex items-center">
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
                    ><X class="h-4 w-4"
                  /></Button>
                </template>
              </InputStandard>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  </div>

  <div class="block md:hidden w-full max-w-md mx-auto space-y-2 mb-6 px-2">
    <div
      class="p-2 bg-muted/60 text-xs rounded-md text-center text-muted-foreground font-medium"
    >
      Zeige {{ filteredMoneyflows.length }} von
      {{ moneyflowsCount || 0 }} Geldbewegungen
    </div>

    <Accordion type="multiple" class="space-y-2">
      <AccordionItem
        v-for="mmf in filteredMoneyflows"
        :key="'mobile-' + mmf.id"
        :value="'item-' + mmf.id"
        class="border rounded-lg bg-background shadow-sm px-4 py-3 text-left relative"
        :class="{ 'border-destructive/30 bg-destructive/5': mmf.private }"
      >
        <div
          class="flex justify-between items-center w-full min-h-[48px] relative"
        >
          <div
            class="flex flex-col gap-0.5 min-w-0 flex-1 pr-4 z-10 pointer-events-none"
          >
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
                v-if="
                  mmf.moneyflowSplitEntries &&
                  mmf.moneyflowSplitEntries.length > 0
                "
                class="bg-primary/20 text-primary px-1 rounded text-[10px]"
                >Aufgeteilt</span
              >
            </div>
            <span class="font-bold text-sm text-foreground truncate block">
              {{ mmf.contractpartnerName || "-" }}
            </span>
          </div>

          <div
            class="flex flex-col items-end gap-1 shrink-0 text-right z-20 relative bg-inherit pl-2"
          >
            <span
              class="font-extrabold text-sm"
              :class="{
                'border-b border-double border-foreground':
                  mmf.moneyflowSplitEntries &&
                  mmf.moneyflowSplitEntries?.length > 0,
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
                <Image class="h-3.5 w-3.5" />
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
            class="absolute inset-0 h-full w-full opacity-0 z-0 p-0 m-0 [&>svg]:hidden"
          />
        </div>

        <AccordionContent class="pt-3 pb-1 space-y-2 border-t mt-2">
          <div
            class="text-xs text-muted-foreground bg-muted/40 p-2 rounded space-y-2"
          >
            <div
              class="flex items-center gap-1.5 break-all w-full"
              v-if="
                !mmf.moneyflowSplitEntries ||
                mmf.moneyflowSplitEntries.length == 0
              "
            >
              <MessageSquareMore
                class="h-4 w-4 shrink-0 text-muted-foreground/80"
                :title="$t('General.comment')"
              />
              <span class="text-foreground">
                {{ mmf.comment }}
              </span>
            </div>
            <div
              class="grid grid-cols-2 gap-1 text-[10px] text-muted-foreground/80 pt-0.5 border-t border-muted/60 mt-1"
            >
              <div class="flex items-center gap-1 min-w-0 truncate">
                <CreditCard
                  class="h-3 w-3 shrink-0 text-muted-foreground/80"
                  :title="$t('General.capitalsource')"
                />

                {{ mmf.capitalsourceComment }}
              </div>
              <div
                v-if="
                  mmf.postingAccountName &&
                  (!mmf.moneyflowSplitEntries ||
                    mmf.moneyflowSplitEntries.length === 0)
                "
                class="flex items-center gap-1 min-w-0 truncate"
              >
                <Tag
                  class="h-3 w-3 shrink-0 text-muted-foreground/80"
                  :title="$t('General.postingAccount')"
                />

                {{ mmf.postingAccountName }}
              </div>
            </div>
          </div>

          <div
            v-if="
              mmf.moneyflowSplitEntries && mmf.moneyflowSplitEntries.length > 0
            "
            class="pl-3 border-l-2 border-primary/30 space-y-1.5 pt-0.5"
          >
            <div
              class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-1"
            >
              Unterbuchungen
            </div>
            <div
              v-for="mse in mmf.moneyflowSplitEntries"
              :key="mse.id"
              class="flex justify-between items-start text-xs bg-muted/20 p-2 rounded"
            >
              <div class="flex flex-col min-w-0 text-left">
                <span
                  class="font-medium text-foreground text-[11px] truncate"
                  >{{ mse.postingAccountName }}</span
                >
                <span
                  class="text-muted-foreground text-[10px] break-all"
                  v-if="mse.comment"
                  >{{ mse.comment }}</span
                >
              </div>
              <span
                class="font-semibold text-[11px] shrink-0 pl-2 text-muted-foreground"
              >
                <SpanAmount :amount="mse.amount" />
              </span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>

    <div
      class="p-4 border rounded-lg bg-muted/40 flex justify-between items-center text-sm font-bold shadow-sm mx-1"
    >
      <span>Gesamtsumme (&Sigma;)</span>
      <span class="underline decoration-double text-base"
        ><SpanAmount :amount="amountSum"
      /></span>
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
  Image,
  MessageSquareMore,
  Pencil,
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
