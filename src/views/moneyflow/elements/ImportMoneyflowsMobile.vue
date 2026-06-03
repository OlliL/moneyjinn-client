<template>
  <AccordionItem
    :value="importedMoneyflow.externalid"
    class="border rounded-lg bg-card shadow-sm overflow-hidden transition-all duration-200"
    :class="
      isReady
        ? 'border-blue-200 dark:border-blue-900/40 bg-blue-50/10'
        : 'border-orange-200 dark:border-orange-900/40 bg-orange-50/5'
    "
  >
    <AccordionTrigger class="p-0 hover:no-underline [&>svg]:hidden w-full">
      <div class="flex flex-col w-full text-left">
        <!-- Summary Area -->
        <div class="p-3 flex flex-col w-full min-w-0">
          <!-- Row 1: Date & Amount -->
          <div class="flex justify-between items-center w-full pb-3">
            <div
              class="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <Calendar class="icon-extra-small" />
              <SpanDate :date="displayData.bookingDate" />
              <template v-if="displayData.invoiceDate">
                <CalendarDays
                  class="icon-extra-small shrink-0 ml-1 text-muted-foreground/60"
                />
                <SpanDate :date="displayData.invoiceDate" />
              </template>
            </div>
            <SpanAmount
              :amount="displayData.amount"
              class="font-extrabold text-base"
            />
          </div>

          <!-- Row 2: Contractpartner Comparison (Target vs Source) -->
          <div class="flex items-start gap-3 pb-3">
            <div
              class="p-2 rounded-full bg-muted/50 shrink-0"
              :class="statusClass(displayData.contractpartnerId > 0)"
            >
              <Handshake class="icon-medium" />
            </div>
            <div class="flex flex-col min-w-0">
              <div
                class="font-bold text-base leading-tight truncate"
                :class="textStatusClass(displayData.contractpartnerId > 0)"
              >
                {{
                  displayData.contractpartnerName ||
                  $t("Moneyflow.validation.contractpartnerId")
                }}
              </div>
              <div
                class="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5"
              >
                <span
                  class="uppercase font-semibold text-[8px] px-1 border rounded shrink-0"
                  >{{ $t("CompareData.source") }}</span
                >
                <span class="truncate">{{ importedMoneyflow.name }}</span>
              </div>
            </div>
          </div>

          <!-- Row 3: Usage (imported transaction) - Full Display -->
          <div
            class="bg-muted/30 p-2.5 rounded border border-border/40 text-xs text-muted-foreground/90 leading-relaxed"
          >
            <div class="flex items-start gap-2">
              <MessageSquareMore
                class="icon-extra-small mt-1 shrink-0 text-muted-foreground/60"
              />
              <div class="break-words whitespace-pre-wrap">
                <SpanImportComment :comment="importedMoneyflow.usage" />
              </div>
            </div>
          </div>

          <!-- System Details (Adopted Data) -->
          <div class="grid grid-cols-1 pt-3 gap-y-2 gap-x-4">
            <!-- Planned Comment -->
            <div
              class="flex items-center gap-2 min-w-0"
              :title="$t('General.comment')"
            >
              <MessageSquareMore
                :class="statusClass(displayData.comment?.length > 0)"
                class="icon-small"
              />
              <span
                class="text-[10px] truncate"
                :class="textStatusClass(displayData.comment?.length > 0)"
              >
                {{ displayData.comment || $t("Moneyflow.validation.comment") }}
              </span>
            </div>

            <!-- Account & Source -->
            <div
              class="flex items-center gap-2 min-w-0"
              :title="$t('General.postingAccount')"
            >
              <Tag
                :class="statusClass(displayData.postingAccountId > 0)"
                class="icon-small"
              />
              <span
                class="text-[10px] truncate"
                :class="textStatusClass(displayData.postingAccountId > 0)"
              >
                {{
                  displayData.postingAccountName ||
                  $t("Moneyflow.validation.postingAccountId")
                }}
              </span>
            </div>
            <div
              class="flex items-center gap-2 min-w-0"
              :title="$t('General.capitalsource')"
            >
              <CreditCard
                :class="statusClass(displayData.capitalsourceId > 0)"
                class="icon-small"
              />
              <span
                class="text-[10px] truncate"
                :class="textStatusClass(displayData.capitalsourceId > 0)"
              >
                {{
                  displayData.capitalsourceComment ||
                  $t("General.validation.capitalsource")
                }}
              </span>
            </div>
          </div>
        </div>

        <!-- Action Bar -->
        <div class="grid grid-cols-2 border-t divide-x bg-muted/30">
          <div
            class="flex items-center justify-center py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted/50 transition-colors"
          >
            <Pencil class="icon-small mr-2" />
            {{ $t("General.edit") }}
          </div>
          <button
            type="button"
            class="flex items-center justify-center py-2.5 text-xs font-bold transition-colors"
            :class="
              isReady
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'text-muted-foreground/40 cursor-not-allowed'
            "
            :disabled="!isReady"
            @click.stop="importItem"
          >
            <Save class="icon-small mr-2" />
            {{ $t("Moneyflow.apply") }}
          </button>
        </div>
      </div>
    </AccordionTrigger>

    <!-- force-mount ensures logic in EditMoneyflowBase runs immediately. 
         v-show handles actual visual visibility based on accordion state. -->
    <AccordionContent class="p-0" force-mount>
      <div class="px-3 pb-4 pt-4 border-t bg-muted/5 space-y-6" v-show="isOpen">
        <EditMoneyflowBase
          ref="editRef"
          :mmf-to-edit="importedMoneyflow"
          :id-suffix="'mobile-' + importedMoneyflow.id"
          :fill-contractpartner-defaults="true"
        />

        <div class="flex justify-center pt-2 border-t border-dashed">
          <ButtonDeleteTwoTap
            :button-label="$t('General.delete')"
            @execute-delete="deleteItem"
          />
        </div>
      </div>
    </AccordionContent>
  </AccordionItem>
</template>

<script lang="ts" setup>
import ButtonDeleteTwoTap from "@/components/common/ButtonDeleteTwoTap.vue";
import SpanAmount from "@/components/common/SpanAmount.vue";
import SpanDate from "@/components/common/SpanDate.vue";
import SpanImportComment from "@/components/common/SpanImportComment.vue";
import EditMoneyflowBase from "@/components/moneyflow/EditMoneyflowBase.vue";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ImportedMoneyflow } from "@/model/moneyflow/ImportedMoneyflow";
import {
  Calendar,
  CalendarDays,
  CreditCard,
  Handshake,
  MessageSquareMore,
  Pencil,
  Save,
  Tag,
} from "lucide-vue-next";
import { computed, ref } from "vue";

const props = defineProps<{
  importedMoneyflow: ImportedMoneyflow;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  itemRemoved: [importedMoneyflowId: number];
}>();

const editRef = ref();

const displayData = computed(() => {
  // Return the reactive object from child or props directly.
  // Vue handles reactivity for sub-properties in the template.
  return editRef.value?.mmf || props.importedMoneyflow;
});

const isReady = computed(() => {
  const mim = displayData.value;
  return (
    mim.contractpartnerId > 0 &&
    mim.postingAccountId > 0 &&
    mim.capitalsourceId > 0 &&
    mim.comment?.length > 0 &&
    mim.bookingDate
  );
});

const statusClass = (valid: boolean) =>
  valid ? "text-blue-500 dark:text-blue-400" : "text-orange-400/70";
const textStatusClass = (valid: boolean) =>
  valid ? "text-foreground font-medium" : "text-orange-400/70 italic";

const importItem = () => {
  editRef.value
    ?.importImportedMoneyflow(props.importedMoneyflow)
    .then((res: boolean) => {
      if (res) emit("itemRemoved", props.importedMoneyflow.id);
    });
};
const deleteItem = () => {
  editRef.value
    ?.deleteImportedMoneyflow(props.importedMoneyflow.id)
    .then((res: boolean) => {
      if (res) emit("itemRemoved", props.importedMoneyflow.id);
    });
};
</script>
