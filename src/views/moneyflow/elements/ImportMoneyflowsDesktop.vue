<template>
  <div
    class="w-full rounded-sm border bg-card text-card-foreground overflow-hidden"
  >
    <form @submit.prevent="$emit('import')">
      <div class="grid grid-cols-1 lg:grid-cols-4 min-h-full">
        <div
          class="bg-muted/40 p-5 border-b lg:border-b-0 lg:border-r border-border/60 space-y-4 text-left"
        >
          <dl class="space-y-1">
            <dt
              class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80"
            >
              {{ $t("General.contractpartner") }}
            </dt>
            <dd
              class="text-sm text-foreground bg-background/80 px-2 py-1 rounded border border-border/40 inline-block font-semibold"
            >
              {{ importedMoneyflow.name }}
            </dd>
          </dl>

          <dl class="space-y-1">
            <dt
              class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80"
            >
              {{ $t("General.iban") }}
            </dt>
            <dd
              class="text-xs text-foreground bg-background/80 px-2 py-1 rounded border border-border/40 inline-block break-all"
            >
              <SpanIban :iban="importedMoneyflow.accountNumber" />
            </dd>
          </dl>

          <dl class="space-y-1">
            <dt
              class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80"
            >
              {{ $t("General.bic") }}
            </dt>
            <dd
              class="text-xs text-foreground bg-background/80 px-2 py-1 rounded border border-border/40 inline-block"
            >
              {{ importedMoneyflow.bankCode }}
            </dd>
          </dl>

          <dl class="space-y-1 pt-2 border-t border-border/40">
            <dt
              class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-1"
            >
              {{ $t("Moneyflow.reference") }}
            </dt>
            <dd
              class="text-xs text-foreground/90 bg-background/60 p-2.5 rounded border border-border/40 leading-relaxed max-h-40 overflow-y-auto backdrop-blur-sm"
            >
              <SpanImportComment :comment="importedMoneyflow.usage" />
            </dd>
          </dl>
        </div>

        <div class="lg:col-span-3 p-6 space-y-6 flex flex-col justify-between">
          <EditMoneyflowBase
            ref="editRef"
            :mmf-to-edit="importedMoneyflow"
            :id-suffix="importedMoneyflow.id + ''"
            :fill-contractpartner-defaults="true"
          />

          <div
            class="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-border/40"
          >
            <Button
              type="button"
              variant="destructive"
              class="flex items-center gap-2 px-6"
              @click="$emit('delete')"
            >
              <Trash2 class="icon-medium" />
              {{ $t("General.delete") }}
            </Button>
            <ButtonSubmit :button-label="$t('Moneyflow.apply')" class="px-6"
              ><template #icon><Save class="icon-medium" /></template
            ></ButtonSubmit>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref, type PropType } from "vue";

import ButtonSubmit from "@/components/common/ButtonSubmit.vue";
import SpanIban from "@/components/common/SpanIban.vue";
import SpanImportComment from "@/components/common/SpanImportComment.vue";
import EditMoneyflowBase from "@/components/moneyflow/EditMoneyflowBase.vue";

import type { ImportedMoneyflow } from "@/model/moneyflow/ImportedMoneyflow";

import { Button } from "@/components/ui/button";
import { Save, Trash2 } from "lucide-vue-next";

const props = defineProps({
  importedMoneyflow: {
    type: Object as PropType<ImportedMoneyflow>,
    required: true,
  },
});

defineEmits(["import", "delete"]);

const editRef = ref();

const deleteImportedMoneyflow = (id: number) =>
  editRef.value?.deleteImportedMoneyflow(id);
const importImportedMoneyflow = (mim: ImportedMoneyflow) =>
  editRef.value?.importImportedMoneyflow(mim);

defineExpose({ deleteImportedMoneyflow, importImportedMoneyflow });
</script>
