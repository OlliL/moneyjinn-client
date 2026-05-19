<template>
  <div
    v-if="!mmf.moneyflowSplitEntries || mmf.moneyflowSplitEntries.length === 0"
    class="p-4 border-b bg-background flex justify-between items-center gap-2"
    :class="{ 'bg-destructive/5': mmf.private }"
  >
    <div class="flex flex-col min-w-0 gap-1">
      <div class="flex items-center gap-2">
        <span class="text-xs text-muted-foreground"
          ><SpanDate :date="mmf.bookingDate"
        /></span>
        <span
          v-if="mmf.private"
          class="text-[10px] bg-destructive/20 text-destructive px-1 rounded"
          >Privat</span
        >
      </div>
      <span class="font-semibold text-sm truncate text-foreground text-left">
        {{ mmf.contractpartnerName }}
      </span>
      <span class="text-xs text-muted-foreground truncate text-left">
        {{ mmf.comment }}
        <span class="text-[10px]">({{ mmf.capitalsourceComment }})</span>
      </span>
    </div>

    <div class="flex items-center gap-3 shrink-0">
      <span class="font-bold text-sm"><SpanAmount :amount="mmf.amount" /></span>
      <div class="flex gap-1">
        <Button
          v-if="mmf.hasReceipt"
          variant="ghost"
          size="icon"
          class="h-7 w-7"
          @click="$emit('showReceipt')"
        >
          <Image class="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          class="h-7 w-7"
          @click="$emit('editMoneyflow')"
        >
          <Pencil class="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  </div>

  <div
    v-else
    class="border-b bg-background"
    :class="{ 'bg-destructive/5': mmf.private }"
  >
    <div class="p-4 pb-2 flex justify-between items-start bg-muted/20">
      <div class="flex flex-col min-w-0 gap-1">
        <div class="flex items-center gap-2">
          <span class="text-xs text-muted-foreground"
            ><SpanDate :date="mmf.bookingDate"
          /></span>
          <span
            class="text-[10px] bg-primary/20 text-primary px-1 rounded font-medium"
            >Aufgeteilt</span
          >
        </div>
        <span class="font-bold text-sm truncate text-left">{{
          mmf.contractpartnerName
        }}</span>
      </div>
      <div class="flex items-center gap-3 shrink-0">
        <span
          class="font-extrabold text-sm border-b border-double border-foreground"
        >
          <SpanAmount :amount="mmf.amount" />
        </span>
        <div class="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            class="h-7 w-7"
            @click="$emit('editMoneyflow')"
          >
            <Pencil class="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>

    <div
      class="pl-6 pr-4 pb-3 space-y-2 border-l-2 border-primary/30 ml-4 mb-2"
    >
      <div
        v-for="split in mmf.moneyflowSplitEntries"
        :key="split.id"
        class="flex justify-between items-center text-xs pt-1 border-t border-muted/50 first:border-0"
      >
        <div class="flex flex-col min-w-0 text-left">
          <span class="font-medium text-muted-foreground truncate">{{
            split.postingAccountName
          }}</span>
          <span class="text-[11px] text-muted-foreground/70 truncate">{{
            split.comment
          }}</span>
        </div>
        <span class="font-semibold text-muted-foreground shrink-0 pl-2">
          <SpanAmount :amount="split.amount" />
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { Image, Pencil } from "lucide-vue-next";
import type { PropType } from "vue";
import SpanAmount from "../SpanAmount.vue";
import SpanDate from "../SpanDate.vue";
defineProps({
  mmf: {
    type: Object as PropType<Moneyflow>,
    required: true,
  },
});

defineEmits(["showReceipt", "editMoneyflow", "deleteMoneyflow"]);
</script>
