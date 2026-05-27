<template>
  <ModalVue
    :title="title"
    maxWidth="max-w-[calc(100%-2rem)] md:max-w-2xl lg:max-w-2xl w-full mx-auto"
    ref="modalComponent"
  >
    <template #body>
      <form
        @submit.prevent="createPreDefMoneyflow"
        :id="'createPreDefMoneyflowForm' + idSuffix"
      >
        <div class="space-y-4">
          <DivError :server-errors="serverErrors" />

          <div class="form-section space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div class="sm:col-span-2">
                <InputStandard
                  v-model="mpm.favoriteAbbreviation"
                  :validation-schema="schema.favoriteAbbreviation"
                  id="favoriteAbbreviation"
                  :field-label="$t('PreDefMoneyflow.favoriteAbbreviation')"
                  maxlength="2"
                />
              </div>
              <div class="sm:col-span-3">
                <InputStandard
                  v-model="mpm.favoriteColor"
                  :validation-schema="schema.favoriteColor"
                  id="favoriteColor"
                  :field-label="$t('PreDefMoneyflow.favoriteColor')"
                />
              </div>
              <div class="sm:col-span-1 flex items-end pb-0.5">
                <button
                  type="button"
                  @click="mpm.isFavorite = !mpm.isFavorite"
                  class="flex items-center justify-center p-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 transition-colors"
                  :title="$t('PreDefMoneyflow.markAsFav')"
                >
                  <Star
                    class="h-5 w-5 transition-all"
                    :class="
                      mpm.isFavorite
                        ? 'fill-primary text-primary'
                        : 'text-muted-foreground'
                    "
                  />
                </button>
              </div>
              <div class="sm:col-span-6"></div>
              <div class="sm:col-span-4">
                <InputStandard
                  v-model="mpm.amount"
                  :validation-schema="schema.amount"
                  id="amount"
                  field-type="number"
                  step="0.01"
                  :field-label="$t('General.amount')"
                >
                  <template #icon><Euro class="icon-medium" /></template>
                </InputStandard>
              </div>
              <div class="sm:col-span-8">
                <InputStandard
                  v-model="mpm.comment"
                  :validation-schema="schema.comment"
                  :id="'comment' + idSuffix"
                  :field-label="$t('General.comment')"
                >
                  <template #icon
                    ><MessageSquareMore class="icon-medium"
                  /></template>
                </InputStandard>
              </div>

              <div class="sm:col-span-8">
                <SelectContractpartner
                  v-model="mpm.contractpartnerId"
                  :validation-schema="schema.contractpartnerId"
                  :id-suffix="'CreatePreDefMoneyflow' + idSuffix"
                  :field-label="$t('General.contractpartner')"
                />
              </div>
              <div class="sm:col-span-4">
                <div class="grid gap-1.5 relative justify-items-start w-full">
                  <Label
                    for="onceAMonth"
                    class="text-left ml-1 text-sm font-medium text-foreground leading-none"
                  >
                    {{ $t("PreDefMoneyflow.onceAMonth") }}
                  </Label>
                  <ToggleGroup
                    type="single"
                    class="border border-input bg-muted inline-flex h-10 rounded-md overflow-hidden p-0 items-stretch w-full"
                    :model-value="mpm.onceAMonth ? 'yes' : 'no'"
                    @update:model-value="
                      (val: any) => val && (mpm.onceAMonth = val === 'yes')
                    "
                    id="onceAMonth"
                  >
                    <ToggleGroupItem
                      value="no"
                      class="text-xs font-medium h-full px-3 flex-1 transition-all rounded-none data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm text-muted-foreground border-r border-input last:border-r-0"
                    >
                      {{ $t("General.no") }}
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="yes"
                      class="text-xs font-medium h-full px-3 flex-1 transition-all rounded-none data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm text-muted-foreground"
                    >
                      {{ $t("General.yes") }}
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>

              <div class="sm:col-span-6">
                <SelectCapitalsource
                  v-model="mpm.capitalsourceId"
                  :validation-schema="schema.capitalsourceId"
                  :id-suffix="'CreatePreDefMoneyflow' + idSuffix"
                  :field-label="$t('General.capitalsource')"
                  :validity-date="validityDate"
                />
              </div>
              <div class="sm:col-span-6">
                <SelectPostingAccount
                  v-model="mpm.postingAccountId"
                  :validation-schema="schema.postingAccountId"
                  :id-suffix="'CreatePreDefMoneyflow' + idSuffix"
                  :field-label="$t('General.postingAccount')"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </template>

    <template #footer>
      <Button
        type="button"
        variant="secondary"
        class="button-with-icon hidden md:flex"
        @click="resetForm"
      >
        <Undo2 class="icon-medium" />
        {{ $t("General.reset") }}
      </Button>

      <ButtonSubmit
        :button-label="$t('General.save')"
        :form-id="'createPreDefMoneyflowForm' + idSuffix"
      >
        <template #icon><Save class="icon-medium" /></template>
      </ButtonSubmit>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import PreDefMoneyflowService from "@/service/PreDefMoneyflowService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { amountSchema, globErr } from "@/tools/views/ZodUtil";
import { Euro, Save, Star, Undo2 } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { computed, ref, toRaw, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import { boolean, number, string, type ZodType } from "zod";
import SelectCapitalsource from "../capitalsource/SelectCapitalsource.vue";
import ButtonSubmit from "../common/ButtonSubmit.vue";
import DivError from "../common/DivError.vue";
import InputStandard from "../common/InputStandard.vue";
import ModalVue from "../common/Modal.vue";
import SelectContractpartner from "../contractpartner/SelectContractpartner.vue";
import SelectPostingAccount from "../postingaccount/SelectPostingAccount.vue";

const { t } = useI18n();

defineProps({
  idSuffix: {
    type: String,
    default: "",
  },
});

const serverErrors = ref(new Array<string>());

const schema: Partial<{ [key in keyof PreDefMoneyflow]: ZodType }> = {
  amount: amountSchema(t("Moneyflow.validation.amount")),
  contractpartnerId: number(
    globErr(t("Moneyflow.validation.contractpartnerId")),
  ).gt(0),
  comment: string(globErr(t("Moneyflow.validation.comment")))
    .min(1)
    .max(100, t("Moneyflow.validation.length.comment")),
  favoriteAbbreviation: string(
    globErr(t("PreDefMoneyflow.validation.favoriteAbbreviation")),
  )
    .min(1)
    .max(2, t("PreDefMoneyflow.validation.length.favoriteAbbreviation")),
  favoriteColor: string(
    globErr(t("PreDefMoneyflow.validation.favoriteColor")),
  ).length(7, t("PreDefMoneyflow.validation.length.favoriteColor")),
  postingAccountId: number(
    globErr(t("Moneyflow.validation.postingAccountId")),
  ).gt(0),
  capitalsourceId: number(globErr(t("General.validation.capitalsource"))).gt(0),
  onceAMonth: boolean().optional(),
  isFavorite: boolean().optional(),
};

const mpm = ref({} as PreDefMoneyflow);
const origMpm = ref({} as PreDefMoneyflow | undefined);
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");
const validityDate = new Date();
validityDate.setHours(0, 0, 0, 0);
const emit = defineEmits(["preDefMoneyflowCreated", "preDefMoneyflowUpdated"]);

const { handleSubmit, values, setFieldTouched } = useForm();

const title = computed(() => {
  return origMpm.value === undefined
    ? t("PreDefMoneyflow.title.create")
    : t("PreDefMoneyflow.title.update");
});

const resetForm = () => {
  if (origMpm.value) {
    mpm.value = structuredClone(toRaw(origMpm.value))!;
  } else {
    mpm.value = {} as PreDefMoneyflow;
    mpm.value.isFavorite = false;
    mpm.value.onceAMonth = false;
    mpm.value.favoriteAbbreviation = "";
    mpm.value.favoriteColor = "";
  }
  serverErrors.value = new Array<string>();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const _show = async (_mpm?: PreDefMoneyflow) => {
  origMpm.value = _mpm ?? undefined;
  resetForm();
  modalComponent.value?._show();
};

const createPreDefMoneyflow = handleSubmit(() => {
  serverErrors.value = new Array<string>();

  if (mpm.value.id > 0) {
    //update
    PreDefMoneyflowService.updatePreDefMoneyflow(mpm.value)
      .then(() => {
        modalComponent.value?._hide();
        emit("preDefMoneyflowUpdated", mpm.value);
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  } else {
    //create
    PreDefMoneyflowService.createPreDefMoneyflow(mpm.value)
      .then((_mpm) => {
        mpm.value = _mpm;
        modalComponent.value?._hide();
        emit("preDefMoneyflowCreated", mpm.value);
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  }
});
defineExpose({ _show });
</script>
