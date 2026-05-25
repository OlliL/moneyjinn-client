<template>
  <div class="w-full space-y-4">
    <Tabs v-model="activeTab" class="w-full">
      <div
        class="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-2"
      >
        <TabsList class="w-full grid grid-cols-4 h-12">
          <TabsTrigger value="notInDb" class="flex flex-col gap-0.5 py-1">
            <span class="text-[10px] uppercase font-bold truncate">{{
              $t("CompareData.onlyImport")
            }}</span>
            <span
              :class="[
                'text-xs font-extrabold',
                compareDatasNotInDatabaseCountClass,
              ]"
            >
              {{ compareDatasNotInDatabase?.length || 0 }}
            </span>
          </TabsTrigger>
          <TabsTrigger value="notInFile" class="flex flex-col gap-0.5 py-1">
            <span class="text-[10px] uppercase font-bold truncate">{{
              $t("CompareData.onlyApp")
            }}</span>
            <span
              :class="[
                'text-xs font-extrabold',
                compareDatasNotInFileCountClass,
              ]"
            >
              {{ compareDatasNotInFile?.length || 0 }}
            </span>
          </TabsTrigger>
          <TabsTrigger value="wrongSource" class="flex flex-col gap-0.5 py-1">
            <span class="text-[10px] uppercase font-bold truncate">{{
              $t("CompareData.wrongAccount")
            }}</span>
            <span
              :class="[
                'text-xs font-extrabold',
                compareDatasWrongCapitalsourceCountClass,
              ]"
            >
              {{ compareDatasWrongCapitalsource?.length || 0 }}
            </span>
          </TabsTrigger>
          <TabsTrigger value="matching" class="flex flex-col gap-0.5 py-1">
            <span class="text-[10px] uppercase font-bold truncate">{{
              $t("CompareData.matching")
            }}</span>
            <span
              :class="[
                'text-xs font-extrabold',
                compareDatasMatchingCountClass,
              ]"
            >
              {{ compareDatasMatching?.length || 0 }}
            </span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="notInDb" class="mt-0">
        <CompareDataResultMobileGroup
          :compare-data="compareDatasNotInDatabase"
          :capitalsource-id="capitalsourceId"
          :capitalsource-comment="capitalsourceComment"
          @create-moneyflow="$emit('createMoneyflow', $event)"
        />
      </TabsContent>

      <TabsContent value="notInFile" class="mt-0">
        <CompareDataResultMobileGroup
          :compare-data="compareDatasNotInFile"
          :capitalsource-id="capitalsourceId"
          :capitalsource-comment="capitalsourceComment"
          @delete-moneyflow="$emit('deleteMoneyflow', $event)"
          @edit-moneyflow="$emit('editMoneyflow', $event)"
        />
      </TabsContent>

      <TabsContent value="wrongSource" class="mt-0">
        <CompareDataResultMobileGroup
          :compare-data="compareDatasWrongCapitalsource"
          :capitalsource-id="capitalsourceId"
          :capitalsource-comment="capitalsourceComment"
          @delete-moneyflow="$emit('deleteMoneyflow', $event)"
          @edit-moneyflow="$emit('editMoneyflow', $event)"
          @create-moneyflow="$emit('createMoneyflow', $event)"
        />
      </TabsContent>

      <TabsContent value="matching" class="mt-0">
        <CompareDataResultMobileGroup
          :compare-data="compareDatasMatching"
          :capitalsource-id="capitalsourceId"
          :capitalsource-comment="capitalsourceComment"
          @delete-moneyflow="$emit('deleteMoneyflow', $event)"
          @edit-moneyflow="$emit('editMoneyflow', $event)"
          @create-moneyflow="$emit('createMoneyflow', $event)"
        />
      </TabsContent>
    </Tabs>
  </div>
</template>

<script lang="ts" setup>
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CompareData } from "@/model/comparedata/CompareData";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { ref, type PropType } from "vue";
import CompareDataResultMobileGroup from "./CompareDataResultMobileGroup.vue";

defineProps({
  compareDatasMatching: {
    type: Array as PropType<CompareData[]>,
    required: false,
  },
  compareDatasMatchingCountClass: { type: String, required: true },
  compareDatasWrongCapitalsource: {
    type: Array as PropType<CompareData[]>,
    required: false,
  },
  compareDatasWrongCapitalsourceCountClass: { type: String, required: true },
  compareDatasNotInFile: {
    type: Array as PropType<CompareData[]>,
    required: false,
  },
  compareDatasNotInFileCountClass: { type: String, required: true },
  compareDatasNotInDatabase: {
    type: Array as PropType<CompareData[]>,
    required: false,
  },
  compareDatasNotInDatabaseCountClass: { type: String, required: true },
  capitalsourceId: { type: Number, required: true },
  capitalsourceComment: { type: String, required: true },
});

defineEmits<{
  deleteMoneyflow: [id: number];
  editMoneyflow: [id: number];
  createMoneyflow: [moneyflow: Moneyflow];
}>();

const activeTab = ref("notInDb");
</script>
