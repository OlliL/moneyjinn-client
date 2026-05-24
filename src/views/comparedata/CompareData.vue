<template>
  <DeleteMoneyflowModalVue ref="deleteModal" @moneyflow-deleted="compareData" />
  <EditMoneyflowModalVue
    ref="editModal"
    @moneyflow-updated="compareData"
    @moneyflow-created="compareData"
  />

  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">{{ $t("CompareData.title") }}</h4>
    </div>
    <div class="flex justify-center">
      <div class="w-full max-w-6xl card-panel p-4">
        <form @submit.prevent="compareData" id="compareDataForm">
          <div class="space-y-4">
            <DivError :server-errors="serverErrors" />
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
    <div class="flex justify-center pt-5" v-if="dataCompared">
      <DivContentTable :alternateRowBackground="false" class="w-full">
        <colgroup>
          <col style="width: 5%" />
          <col style="width: 5%" />
          <col style="width: 90%" />
        </colgroup>
        <TableHeader>
          <TableRow>
            <TableHead
              class="font-bold text-foreground text-center"
              colspan="3"
              >{{ $t("CompareData.result") }}</TableHead
            >
          </TableRow>
        </TableHeader>
        <TableBody>
          <CompareDataResultGroupVue
            :comment="$t('CompareData.dataInSourceNotInDb')"
            :compare-data="compareDatasNotInDatabase"
            group-test-id="compare-data-group-not-in-database"
            :amount-class="compareDatasNotInDatabaseCountClass"
            :capitalsource-id="capitalsourceId"
            :capitalsource-comment="capitalsourceComment"
            @create-moneyflow="createMoneyflow"
          />
          <CompareDataResultGroupVue
            :comment="$t('CompareData.dataNotInSourceInDb')"
            :compare-data="compareDatasNotInFile"
            group-test-id="compare-data-group-not-in-file"
            :amount-class="compareDatasNotInFileCountClass"
            :capitalsource-id="capitalsourceId"
            :capitalsource-comment="capitalsourceComment"
            @delete-moneyflow="deleteMoneyflow"
            @edit-moneyflow="editMoneyflow"
            @create-moneyflow="createMoneyflow"
          />
          <CompareDataResultGroupVue
            :comment="$t('CompareData.dataMatchingButWrongCapitalsource')"
            :compare-data="compareDatasWrongCapitalsource"
            group-test-id="compare-data-group-wrong-capitalsource"
            :amount-class="compareDatasWrongCapitalsourceCountClass"
            :capitalsource-id="capitalsourceId"
            :capitalsource-comment="capitalsourceComment"
            @delete-moneyflow="deleteMoneyflow"
            @edit-moneyflow="editMoneyflow"
            @create-moneyflow="createMoneyflow"
          />
          <CompareDataResultGroupVue
            :comment="$t('CompareData.dataMatching')"
            :compare-data="compareDatasMatching"
            group-test-id="compare-data-group-matching"
            :amount-class="compareDatasMatchingCountClass"
            :capitalsource-id="capitalsourceId"
            :capitalsource-comment="capitalsourceComment"
            @delete-moneyflow="deleteMoneyflow"
            @edit-moneyflow="editMoneyflow"
            @create-moneyflow="createMoneyflow"
          />
        </TableBody>
      </DivContentTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SelectCapitalsource from "@/components/capitalsource/SelectCapitalsource.vue";
import ButtonSubmit from "@/components/common/ButtonSubmit.vue";
import DivContentTable from "@/components/common/DivContentTable.vue";
import DivError from "@/components/common/DivError.vue";
import InputDate from "@/components/common/InputDate.vue";
import InputFile from "@/components/common/InputFile.vue";
import SelectStandard from "@/components/common/SelectStandard.vue";
import DeleteMoneyflowModalVue from "@/components/moneyflow/DeleteMoneyflowModal.vue";
import EditMoneyflowModalVue from "@/components/moneyflow/EditMoneyflowModal.vue";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CompareData } from "@/model/comparedata/CompareData";
import type { CompareDataParameter } from "@/model/comparedata/CompareDataParameter";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import type { SelectBoxValue } from "@/model/SelectBoxValue";
import CompareDataService from "@/service/CompareDataService";
import MoneyflowService from "@/service/MoneyflowService";
import { useCapitalsourceStore } from "@/stores/CapitalsourceStore";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { globErr } from "@/tools/views/ZodUtil";
import { Eye } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { computed, onMounted, ref, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import { any, array as arr, date, instanceof as instof, number } from "zod";
import CompareDataResultGroupVue from "./elements/CompareDataResultGroup.vue";

const { t } = useI18n();

const serverErrors = ref(new Array<string>());

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

const deleteModal =
  useTemplateRef<typeof DeleteMoneyflowModalVue>("deleteModal");
const editModal = useTemplateRef<typeof EditMoneyflowModalVue>("editModal");

const { handleSubmit, values, setFieldTouched } = useForm();

onMounted(() => {
  loadData();
});

const sourceIsImportLabel = computed(() => {
  return sourceIsImport.value ? t("CompareData.import") : t("CompareData.file");
});
const compareDatasMatchingCount = computed(() => {
  return compareDatasMatching.value ? compareDatasMatching.value.length : 0;
});
const compareDatasMatchingCountClass = computed(() => {
  return compareDatasMatchingCount.value > 0
    ? "text-green-600"
    : "text-red-600";
});
const compareDatasWrongCapitalsourceCount = computed(() => {
  return compareDatasWrongCapitalsource.value
    ? compareDatasWrongCapitalsource.value.length
    : 0;
});
const compareDatasWrongCapitalsourceCountClass = computed(() => {
  return compareDatasWrongCapitalsourceCount.value > 0
    ? "text-red-600"
    : "text-green-600";
});
const compareDatasNotInFileCount = computed(() => {
  return compareDatasNotInFile.value ? compareDatasNotInFile.value.length : 0;
});
const compareDatasNotInFileCountClass = computed(() => {
  return compareDatasNotInFileCount.value > 0
    ? "text-red-600"
    : "text-green-600";
});
const compareDatasNotInDatabaseCount = computed(() => {
  return compareDatasNotInDatabase.value
    ? compareDatasNotInDatabase.value.length
    : 0;
});
const compareDatasNotInDatabaseCountClass = computed(() => {
  return compareDatasNotInDatabaseCount.value > 0
    ? "text-red-600"
    : "text-green-600";
});

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
      for (let fmt of compareDataParameter.compareDataFormats) {
        compareDataFormats.value.push({ id: fmt.formatId, value: fmt.name });
      }

      capitalsourceId.value = compareDataParameter.selectedCapitalSourceId;
      if (capitalsourceId.value) {
        const capitalsourceStore = useCapitalsourceStore();
        const capitalsource = capitalsourceStore.getCapitalsource(
          capitalsourceId.value,
        );
        if (capitalsource) {
          capitalsourceComment.value = capitalsource.comment;
        }
      }
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });

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

const compareData = handleSubmit(async () => {
  dataCompared.value = false;
  serverErrors.value = new Array<string>();

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

        dataCompared.value = true;
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  }
});

const deleteMoneyflow = (id: number) => {
  MoneyflowService.fetchMoneyflow(id).then((mmf) => {
    deleteModal.value?._show(mmf);
  });
};
const editMoneyflow = (id: number) => {
  MoneyflowService.fetchMoneyflow(id).then((mmf) => {
    editModal.value?._show(mmf);
  });
};
const createMoneyflow = (moneyflow: Moneyflow) => {
  editModal.value?._show(moneyflow);
};
</script>
