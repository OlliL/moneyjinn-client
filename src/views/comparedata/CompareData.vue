<template>
  <DeleteMoneyflowModalVue ref="deleteModal" @moneyflow-deleted="compareData" />
  <EditMoneyflowModalVue ref="editModal" @moneyflow-updated="compareData" />

  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>{{ $t("CompareData.title") }}</h4>
      </div>
    </div>
    <div class="row justify-content-md-center mb-2">
      <div class="col-xxl-7 col-md-8 col-sm-10 col-xs-12">
        <div class="card w-100 bg-light">
          <div class="card-body">
            <form @submit.prevent="compareData" id="compareDataForm">
              <div class="container-fluid">
                <DivError :server-errors="serverErrors" />
                <div class="row">
                  <div class="col-md-3 col-xs-12 mb-2">
                    <InputDate
                      v-model="startDate"
                      :validation-schema="schema.startDate"
                      id="startDate"
                      :field-label="$t('General.startDate')"
                    />
                  </div>
                  <div class="col-md-3 col-xs-12">
                    <InputDate
                      v-model="endDate"
                      :validation-schema="schema.endDate"
                      id="endDate"
                      :field-label="$t('General.endDate')"
                    />
                  </div>
                  <div class="col-md-4 col-xs-12">
                    <SelectCapitalsource
                      v-model="capitalsourceId"
                      :validation-schema="schema.capitalsourceId"
                      id-suffix="CompareData"
                      :field-label="$t('General.capitalsource')"
                      :validity-date="new Date()"
                    />
                  </div>
                  <div class="col-md-2 col-xs-12 d-flex align-items-center">
                    <div class="form-check form-switch text-start">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="sourceIsImport"
                        v-model="sourceIsImport"
                      />
                      <label class="form-check-label" for="sourceIsImport">{{
                        sourceIsImportLabel
                      }}</label>
                    </div>
                  </div>
                </div>
                <div class="row align-items-center" v-show="!sourceIsImport">
                  <div class="col-md-6 col-xs-12 mb-2 text-start">
                    <InputFile
                      v-model="files"
                      :validation-schema-ref="schema.importfile"
                      id="fileUpload"
                      :field-label="$t('CompareData.importfile')"
                    />
                  </div>
                  <div class="col-md-4 col-xs-12 mb-2">
                    <SelectStandard
                      v-model="compareDataFormat"
                      :validation-schema-ref="schema.compareDataFormat"
                      id="compareDataFormat"
                      :field-label="$t('CompareData.format')"
                      :select-box-values="compareDataFormats"
                    />
                  </div>
                </div>
                <div class="row mt-2">
                  <div class="col-12">
                    <ButtonSubmit
                      :button-label="$t('General.show')"
                      form-id="compareDataForm"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-content-md-center mt-4" v-if="dataCompared">
      <div class="col-xxl-10 col-md-12 col-sm-12 col-xs-12">
        <table class="table table-striped table-bordered">
          <col style="width: 5%" />
          <col style="width: 5%" />
          <col style="width: 90%" />
          <tbody>
            <CompareDataResultGroupVue
              :comment="$t('CompareData.dataInSourceNotInDb')"
              :compare-data="compareDatasNotInDatabase"
              compare-data-key="notInDatabase"
              :amount-class="compareDatasNotInDatabaseCountClass"
              :capitalsource-comment="capitalsourceComment"
            />
            <CompareDataResultGroupVue
              :comment="$t('CompareData.dataNotInSourceInDb')"
              :compare-data="compareDatasNotInFile"
              compare-data-key="notInFile"
              :amount-class="compareDatasNotInFileCountClass"
              :capitalsource-comment="capitalsourceComment"
              @delete-moneyflow="deleteMoneyflow"
              @edit-moneyflow="editMoneyflow"
            />
            <CompareDataResultGroupVue
              :comment="$t('CompareData.dataMatchingButWrongCapitalsource')"
              :compare-data="compareDatasWrongCapitalsource"
              compare-data-key="wrongCapitalsource"
              :amount-class="compareDatasWrongCapitalsourceCountClass"
              :capitalsource-comment="capitalsourceComment"
              @delete-moneyflow="deleteMoneyflow"
              @edit-moneyflow="editMoneyflow"
            />
            <CompareDataResultGroupVue
              :comment="$t('CompareData.dataMatching')"
              :compare-data="compareDatasMatching"
              compare-data-key="matching"
              :amount-class="compareDatasMatchingCountClass"
              :capitalsource-comment="capitalsourceComment"
              @delete-moneyflow="deleteMoneyflow"
              @edit-moneyflow="editMoneyflow"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { any, date, number, array as arr, instanceof as instof } from "zod";

import ButtonSubmit from "@/components/ButtonSubmit.vue";
import CompareDataResultGroupVue from "@/components/comparedata/CompareDataResultGroup.vue";
import DeleteMoneyflowModalVue from "@/components/moneyflow/DeleteMoneyflowModal.vue";
import DivError from "@/components/DivError.vue";
import EditMoneyflowModalVue from "@/components/moneyflow/EditMoneyflowModal.vue";
import InputDate from "@/components/InputDate.vue";
import InputFile from "@/components/InputFile.vue";
import SelectCapitalsource from "@/components/capitalsource/SelectCapitalsource.vue";
import SelectStandard from "@/components/SelectStandard.vue";

import { useCapitalsourceStore } from "@/stores/CapitalsourceStore";

import { globErr } from "@/tools/views/ZodUtil";

import type { CompareData } from "@/model/comparedata/CompareData";
import type { CompareDataParameter } from "@/model/comparedata/CompareDataParameter";
import type { SelectBoxValue } from "@/model/SelectBoxValue";

import CompareDataControllerHandler from "@/handler/CompareDataControllerHandler";
import MoneyflowControllerHandler from "@/handler/MoneyflowControllerHandler";
import { handleBackendError } from "@/tools/views/HandleBackendError";

const { t } = useI18n();

const serverErrors = ref(new Array<string>());

const schema = {
  startDate: date(globErr(t("General.validation.startDate"))),
  endDate: date(globErr(t("General.validation.endDate"))),
  capitalsourceId: number(globErr(t("General.validation.capitalsource"))).gt(0),
  compareDataFormat: computed(() => {
    if (!sourceIsImport.value) {
      return number(globErr(t("CompareData.validation.compareDataFormat"))).gt(
        0
      );
    } else {
      return any().optional();
    }
  }),
  importfile: computed(() => {
    if (!sourceIsImport.value) {
      return arr(instof(File), globErr(t("CompareData.validation.importfile")));
    } else {
      return any().optional();
    }
  }),
};

const dataLoaded = ref(false);
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
  {} as Array<CompareData> | undefined
);
const compareDatasNotInFile = ref({} as Array<CompareData> | undefined);
const compareDatasNotInDatabase = ref({} as Array<CompareData> | undefined);
const files = ref({} as FileList);

const deleteModal = ref();
const editModal = ref();

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
  return compareDatasMatchingCount.value > 0 ? "text-success" : "text-danger";
});
const compareDatasWrongCapitalsourceCount = computed(() => {
  return compareDatasWrongCapitalsource.value
    ? compareDatasWrongCapitalsource.value.length
    : 0;
});
const compareDatasWrongCapitalsourceCountClass = computed(() => {
  return compareDatasWrongCapitalsourceCount.value > 0
    ? "text-danger"
    : "text-success";
});
const compareDatasNotInFileCount = computed(() => {
  return compareDatasNotInFile.value ? compareDatasNotInFile.value.length : 0;
});
const compareDatasNotInFileCountClass = computed(() => {
  return compareDatasNotInFileCount.value > 0 ? "text-danger" : "text-success";
});
const compareDatasNotInDatabaseCount = computed(() => {
  return compareDatasNotInDatabase.value
    ? compareDatasNotInDatabase.value.length
    : 0;
});
const compareDatasNotInDatabaseCountClass = computed(() => {
  return compareDatasNotInDatabaseCount.value > 0
    ? "text-danger"
    : "text-success";
});

const loadData = () => {
  dataLoaded.value = false;
  const _startDate = new Date();
  _startDate.setDate(1);
  const _endDate = new Date();
  _endDate.setMonth(_endDate.getMonth() + 1);
  _endDate.setDate(0);

  startDate.value = _startDate;
  endDate.value = _endDate;

  CompareDataControllerHandler.showCompareDataForm()
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
          capitalsourceId.value
        );
        if (capitalsource) {
          capitalsourceComment.value = capitalsource.comment;
        }
      }

      dataLoaded.value = true;
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });

  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

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
        const arrayBuffer = new Uint8Array(await file.arrayBuffer());
        let fileContents: string = "";
        for (var i = 0; i < arrayBuffer.byteLength; i++) {
          fileContents += String.fromCharCode(arrayBuffer[i]);
        }
        compareDataParameter.fileContents = btoa(fileContents);
        compareDataParameter.selectedCompareDataFormat =
          compareDataFormat.value;
      }
    }

    CompareDataControllerHandler.compareData(compareDataParameter)
      .then((compareDataResult) => {
        compareDatasMatching.value = compareDataResult.compareDatasMatching;
        compareDatasNotInDatabase.value =
          compareDataResult.compareDatasNotInDatabase;
        compareDatasNotInFile.value = compareDataResult.compareDatasNotInFile;
        compareDatasWrongCapitalsource.value =
          compareDataResult.compareDatasWrongCapitalsource;

        dataCompared.value = true;
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  }
});

const deleteMoneyflow = (id: number) => {
  MoneyflowControllerHandler.fetchMoneyflow(id).then((mmf) => {
    deleteModal.value._show(mmf);
  });
};
const editMoneyflow = (id: number) => {
  MoneyflowControllerHandler.fetchMoneyflow(id).then((mmf) => {
    editModal.value._show(mmf);
  });
};
</script>
