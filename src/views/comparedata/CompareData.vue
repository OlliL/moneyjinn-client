<template>
  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">{{ $t("CompareData.title") }}</h4>
    </div>
    <div class="flex justify-center">
      <div class="w-full max-w-4xl card-panel p-4">
        <form @submit.prevent="compareData" id="compareDataForm">
          <div class="space-y-4">
            <div class="grid gap-3 grid-cols-6 md:grid-cols-12">
              <div class="col-span-3">
                <InputDate
                  v-model="startDate"
                  :validation-schema="schema.startDate"
                  id="startDate"
                  :field-label="$t('General.startDate')"
                />
              </div>
              <div class="col-span-3">
                <InputDate
                  v-model="endDate"
                  :validation-schema="schema.endDate"
                  id="endDate"
                  :field-label="$t('General.endDate')"
                  picker-align="end"
                />
              </div>
              <div class="col-span-6 md:col-span-4">
                <SelectCapitalsource
                  v-model="capitalsourceId"
                  :validation-schema="schema.capitalsourceId"
                  id-suffix="CompareData"
                  :field-label="$t('General.capitalsource')"
                  :validity-date="new Date()"
                />
              </div>

              <div
                class="md:col-span-2 flex items-start gap-3 md:px-3 md:py-2 md:mt-5"
              >
                <Switch id="sourceIsImport" v-model="sourceIsImport" />
                <Label
                  for="sourceIsImport"
                  class="cursor-pointer text-sm font-medium select-none"
                >
                  {{ sourceIsImportLabel }}
                </Label>
              </div>
            </div>
            <div class="grid gap-3 md:grid-cols-12" v-show="!sourceIsImport">
              <div class="md:col-span-6 text-left">
                <InputFile
                  v-model="files"
                  :validation-schema-ref="schema.importfile"
                  id="fileUpload"
                  :field-label="$t('CompareData.importfile')"
                />
              </div>
              <div class="md:col-span-4">
                <SelectStandard
                  v-model="compareDataFormat"
                  :validation-schema-ref="schema.compareDataFormat"
                  id="compareDataFormat"
                  :field-label="$t('CompareData.format')"
                  :select-box-values="compareDataFormats"
                />
              </div>
            </div>
            <div class="md:pt-2 flex justify-center">
              <ButtonSubmit
                :button-label="$t('General.show')"
                form-id="compareDataForm"
                test-id="compare-data-submit"
                ><template #icon><Eye class="icon-medium" /></template
              ></ButtonSubmit>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="flex justify-center" v-if="dataCompared">
      <CompareDataResultDesktop
        class="hidden md:block"
        :compare-datas-matching="compareDatasMatching"
        :compare-datas-matching-count-class="compareDatasMatchingCountClass"
        :compare-datas-wrong-capitalsource="compareDatasWrongCapitalsource"
        :compare-datas-wrong-capitalsource-count-class="
          compareDatasWrongCapitalsourceCountClass
        "
        :compare-datas-not-in-file="compareDatasNotInFile"
        :compare-datas-not-in-file-count-class="compareDatasNotInFileCountClass"
        :compare-datas-not-in-database="compareDatasNotInDatabase"
        :compare-datas-not-in-database-count-class="
          compareDatasNotInDatabaseCountClass
        "
        :capitalsource-id="capitalsourceId"
        :capitalsource-comment="capitalsourceComment"
      />
      <CompareDataResultMobile
        class="md:hidden"
        :compare-datas-matching="compareDatasMatching"
        :compare-datas-matching-count-class="compareDatasMatchingCountClass"
        :compare-datas-wrong-capitalsource="compareDatasWrongCapitalsource"
        :compare-datas-wrong-capitalsource-count-class="
          compareDatasWrongCapitalsourceCountClass
        "
        :compare-datas-not-in-file="compareDatasNotInFile"
        :compare-datas-not-in-file-count-class="compareDatasNotInFileCountClass"
        :compare-datas-not-in-database="compareDatasNotInDatabase"
        :compare-datas-not-in-database-count-class="
          compareDatasNotInDatabaseCountClass
        "
        :capitalsource-id="capitalsourceId"
        :capitalsource-comment="capitalsourceComment"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import SelectCapitalsource from "@/components/capitalsource/SelectCapitalsource.vue";
import ButtonSubmit from "@/components/common/ButtonSubmit.vue";
import InputDate from "@/components/common/InputDate.vue";
import InputFile from "@/components/common/InputFile.vue";
import SelectStandard from "@/components/common/SelectStandard.vue";
import { useDeleteMoneyflowModalStore } from "@/components/moneyflow/DeleteMoneyflowModal.store";
import useEditMoneyflowModalStore from "@/components/moneyflow/EditMoneyflowModal.store";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { CompareData } from "@/model/comparedata/CompareData";
import type { CompareDataParameter } from "@/model/comparedata/CompareDataParameter";
import {
  CompareDataActionsKey,
  type CompareDataActions,
} from "@/model/CrudActions.ts";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import type { SelectBoxValue } from "@/model/SelectBoxValue";
import CompareDataService from "@/service/CompareDataService";
import MoneyflowService from "@/service/MoneyflowService";
import { useCapitalsourceStore } from "@/stores/CapitalsourceStore";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { globErr } from "@/tools/views/ZodUtil";
import { Eye } from "@lucide/vue";
import { useForm } from "vee-validate";
import { computed, onMounted, provide, ref } from "vue";
import { useI18n } from "vue-i18n";
import { any, array as arr, date, instanceof as instof, number } from "zod";
import CompareDataResultDesktop from "./elements/CompareDataResultDesktop.vue";
import CompareDataResultMobile from "./elements/CompareDataResultMobile.vue";

const { t } = useI18n();

const schema = {
  startDate: date(globErr(t("General.validation.startDate"))),
  endDate: date(globErr(t("General.validation.endDate"))),
  capitalsourceId: number(globErr(t("General.validation.capitalsource"))).gt(0),
  compareDataFormat: computed(() =>
    sourceIsImport.value
      ? any().optional()
      : number(globErr(t("CompareData.validation.compareDataFormat"))).gt(0),
  ),
  importfile: computed(() =>
    sourceIsImport.value
      ? any().optional()
      : arr(instof(File), globErr(t("CompareData.validation.importfile"))),
  ),
};
const capitalsourceStore = useCapitalsourceStore();
const dataCompared = ref(false);
const startDate = ref(new Date() as Date | undefined);
const endDate = ref(new Date() as Date | undefined);
const capitalsourceId = ref(0);
const capitalsourceComment = ref("");
const sourceIsImport = ref(true);
const compareDataFormat = ref(0);
const compareDataFormats = ref(new Array<SelectBoxValue>());
const compareDatasMatching = ref({} as Array<CompareData> | undefined);
const compareDatasWrongCapitalsource = ref(
  {} as Array<CompareData> | undefined,
);
const compareDatasNotInFile = ref({} as Array<CompareData> | undefined);
const compareDatasNotInDatabase = ref({} as Array<CompareData> | undefined);
const files = ref({} as FileList);
const { openDelete: openDeleteMoneyflow } = useDeleteMoneyflowModalStore();
const { openEditMoneyflow } = useEditMoneyflowModalStore();

const { handleSubmit, values, setFieldTouched } = useForm();

onMounted(() => {
  loadData();
});

const sourceIsImportLabel = computed(() =>
  sourceIsImport.value ? t("CompareData.import") : t("CompareData.file"),
);
const compareDatasMatchingCount = computed(() =>
  compareDatasMatching.value ? compareDatasMatching.value.length : 0,
);
const compareDatasMatchingCountClass = computed(() =>
  compareDatasMatchingCount.value > 0 ? "text-green-600" : "text-red-600",
);
const compareDatasWrongCapitalsourceCount = computed(() =>
  compareDatasWrongCapitalsource.value
    ? compareDatasWrongCapitalsource.value.length
    : 0,
);
const compareDatasWrongCapitalsourceCountClass = computed(() =>
  compareDatasWrongCapitalsourceCount.value > 0
    ? "text-red-600"
    : "text-green-600",
);
const compareDatasNotInFileCount = computed(() =>
  compareDatasNotInFile.value ? compareDatasNotInFile.value.length : 0,
);
const compareDatasNotInFileCountClass = computed(() =>
  compareDatasNotInFileCount.value > 0 ? "text-red-600" : "text-green-600",
);
const compareDatasNotInDatabaseCount = computed(() =>
  compareDatasNotInDatabase.value ? compareDatasNotInDatabase.value.length : 0,
);
const compareDatasNotInDatabaseCountClass = computed(() =>
  compareDatasNotInDatabaseCount.value > 0 ? "text-red-600" : "text-green-600",
);

const loadData = () => {
  const _startDate = new Date();
  _startDate.setDate(1);
  const _endDate = new Date();
  _endDate.setMonth(_endDate.getMonth() + 1);
  _endDate.setDate(0);

  startDate.value = _startDate;
  endDate.value = _endDate;

  CompareDataService.showCompareDataForm()
    .then((compareDataParameter) => {
      sourceIsImport.value = compareDataParameter.selectedSourceIsImport;
      compareDataFormat.value = compareDataParameter.selectedCompareDataFormat;

      compareDataFormats.value = new Array<SelectBoxValue>();
      for (const fmt of compareDataParameter.compareDataFormats) {
        compareDataFormats.value.push({ id: fmt.formatId, value: fmt.name });
      }

      capitalsourceId.value = compareDataParameter.selectedCapitalSourceId;
      if (capitalsourceId.value) {
        const capitalsource = capitalsourceStore.getCapitalsource(
          capitalsourceId.value,
        );
        if (capitalsource) {
          capitalsourceComment.value = capitalsource.comment;
        }
      }
    })
    .catch(handleBackendError);
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const compareMoneyflowsByDate = (dataA: CompareData, dataB: CompareData) => {
  const bookingDate =
    dataA.moneyflow!.bookingDate.getTime()! -
    dataB.moneyflow!.bookingDate?.getTime();
  if (bookingDate === 0) {
    return (
      dataA.moneyflow!.invoiceDate!.getTime()! -
      dataB.moneyflow!.invoiceDate!.getTime()
    );
  }
  return bookingDate;
};

const compareCompareDataDatasetByDate = (
  dataA: CompareData,
  dataB: CompareData,
) =>
  dataA.compareDataDataset!.bookingDate.getTime()! -
  dataB.compareDataDataset!.bookingDate?.getTime();

const restartComparison = () => {
  compareData();
};
const compareData = handleSubmit(async () => {
  dataCompared.value = false;

  if (startDate.value && endDate.value) {
    const compareDataParameter = {
      startDate: startDate.value,
      endDate: endDate.value,
      selectedCapitalSourceId: capitalsourceId.value,
      selectedSourceIsImport: sourceIsImport.value,
    } as CompareDataParameter;

    if (!sourceIsImport.value) {
      if (files.value != null && files.value.length === 1) {
        const file = files.value[0];
        const arrayBuffer = new Uint8Array(await file!.arrayBuffer());
        let fileContents: string = "";
        for (let i = 0; i < arrayBuffer.byteLength; i++) {
          fileContents += String.fromCodePoint(arrayBuffer[i]!);
        }
        compareDataParameter.fileContents = btoa(fileContents);
        compareDataParameter.selectedCompareDataFormat =
          compareDataFormat.value;
      }
    }

    CompareDataService.compareData(compareDataParameter)
      .then((compareDataResult) => {
        compareDatasMatching.value =
          compareDataResult.compareDatasMatching.sort(compareMoneyflowsByDate);
        compareDatasNotInDatabase.value =
          compareDataResult.compareDatasNotInDatabase.sort(
            compareCompareDataDatasetByDate,
          );
        compareDatasNotInFile.value =
          compareDataResult.compareDatasNotInFile.sort(compareMoneyflowsByDate);
        compareDatasWrongCapitalsource.value =
          compareDataResult.compareDatasWrongCapitalsource.sort(
            compareMoneyflowsByDate,
          );

        const capitalsource = capitalsourceStore.getCapitalsource(
          capitalsourceId.value,
        );
        if (capitalsource) {
          capitalsourceComment.value = capitalsource.comment;
        }
        dataCompared.value = true;
      })
      .catch(handleBackendError);
  }
});

const actions: CompareDataActions = {
  create: (mmf: Moneyflow) =>
    openEditMoneyflow(mmf, undefined, restartComparison),
  edit: (id: number) =>
    MoneyflowService.fetchMoneyflow(id).then((mmf) => {
      openEditMoneyflow(mmf, undefined, restartComparison);
    }),
  delete: (id: number) =>
    MoneyflowService.fetchMoneyflow(id).then((mmf) => {
      openDeleteMoneyflow(mmf, restartComparison);
    }),
};

provide(CompareDataActionsKey, actions);
</script>
