<template>
  <div
    @click="$emit('update:modelValue', props.mmf.id)"
    class="flex items-start justify-between p-3 border rounded-xl bg-card transition-all cursor-pointer active:scale-[0.99] gap-3"
    :class="
      modelValue === props.mmf.id
        ? 'border-primary bg-primary/5 shadow-sm'
        : 'border-border bg-muted/10 hover:bg-muted/20'
    "
  >
    <div class="flex items-start gap-3 min-w-0 flex-1">
      <div class="flex items-center justify-center pt-0.5" @click.stop>
        <RadioGroupItem
          :id="'radio-mobile-' + props.mmf.id"
          :value="String(props.mmf.id)"
          :data-testid="'moneyflow-radio-mobile-' + props.mmf.id"
          class="icon-small rounded-full border border-primary text-primary shadow focus:outline-none"
        />
      </div>

      <div class="space-y-1 min-w-0 text-xs">
        <div
          class="flex items-center gap-2 min-w-0 text-muted-foreground font-medium runcate"
        >
          <CalendarDays class="icon-small text-muted-foreground/60 shrink-0" />
          <SpanDate :date="mmf.invoiceDate" />
        </div>
        <div class="flex items-center gap-1 min-w-0 truncate">
          <Handshake
            class="h-3 w-3 shrink-0 text-foreground/80"
            :title="$t('General.comment')"
          />
          <span class="font-medium text-foreground text-sm truncate">{{
            mmf.contractpartnerName
          }}</span>
        </div>
        <div class="flex items-center gap-1 min-w-0 truncate">
          <MessageSquareMore
            class="h-3 w-3 shrink-0 text-muted-foreground/80"
            :title="$t('General.comment')"
          />
          <span class="font-medium text-muted-foreground text-xs truncate">{{
            mmf.comment
          }}</span>
        </div>
      </div>
    </div>

    <div
      class="flex flex-col items-end justify-between h-full min-h-[65px] shrink-0"
    >
      <div class="font-bold text-sm text-right">
        <SpanAmount :amount="mmf.amount" />
      </div>

      <div class="flex items-center gap-0.5 mt-2" @click.stop>
        <template v-if="isOwnMoneyflow">
          <Button
            variant="ghost"
            size="icon"
            @click="editMoneyflow"
            class="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground"
          >
            <Pencil class="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            @click="deleteMoneyflow"
            class="h-7 w-7 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 class="h-3.5 w-3.5" />
          </Button>
        </template>
        <template v-else>
          <Button
            variant="ghost"
            size="icon"
            @click="listMoneyflow"
            class="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground"
          >
            <Eye class="h-3.5 w-3.5" />
          </Button>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SpanAmount from "@/components/common/SpanAmount.vue";
import SpanDate from "@/components/common/SpanDate.vue";
import { Button } from "@/components/ui/button";
import { RadioGroupItem } from "@/components/ui/radio-group";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import {
  CalendarDays,
  Eye,
  Handshake,
  MessageSquareMore,
  Pencil,
  Trash2,
} from "lucide-vue-next";
import { computed, type PropType } from "vue";

const props = defineProps({
  mmf: {
    type: Object as PropType<Moneyflow>,
    required: true,
  },
  modelValue: {
    type: Number,
    required: true,
  },
});

const userSessionStore = useUserSessionStore();
const emit = defineEmits([
  "deleteMoneyflow",
  "editMoneyflow",
  "listMoneyflow",
  "update:modelValue",
]);

const isOwnMoneyflow = computed(() => {
  return props.mmf.userId === userSessionStore.getUserId;
});

const deleteMoneyflow = () => {
  emit("deleteMoneyflow", props.mmf.id);
};
const editMoneyflow = () => {
  emit("editMoneyflow", props.mmf.id);
};
const listMoneyflow = () => {
  emit("listMoneyflow", props.mmf.id);
};
</script>
