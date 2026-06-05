<template>
  <div class="w-full space-y-4">
    <Tabs v-model="activeTab" class="w-full">
      <div
        class="sticky top-[45px] z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-2 border-b shadow-sm"
      >
        <TabsList class="w-full grid grid-cols-4 h-12! p-1">
          <TabsTrigger
            value="notInDb"
            class="flex flex-col justify-center gap-0.5 py-1"
          >
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
          <TabsTrigger
            value="notInFile"
            class="flex flex-col justify-center gap-0.5 py-1"
          >
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
          <TabsTrigger
            value="wrongSource"
            class="flex flex-col justify-center gap-0.5 py-1"
          >
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
          <TabsTrigger
            value="matching"
            class="flex flex-col justify-center gap-0.5 py-1"
          >
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
        />
      </TabsContent>

      <TabsContent value="notInFile" class="mt-0">
        <CompareDataResultMobileGroup
          :compare-data="compareDatasNotInFile"
          :capitalsource-id="capitalsourceId"
          :capitalsource-comment="capitalsourceComment"
        />
      </TabsContent>

      <TabsContent value="wrongSource" class="mt-0">
        <CompareDataResultMobileGroup
          :compare-data="compareDatasWrongCapitalsource"
          :capitalsource-id="capitalsourceId"
          :capitalsource-comment="capitalsourceComment"
        />
      </TabsContent>

      <TabsContent value="matching" class="mt-0">
        <CompareDataResultMobileGroup
          :compare-data="compareDatasMatching"
          :capitalsource-id="capitalsourceId"
          :capitalsource-comment="capitalsourceComment"
        />
      </TabsContent>
    </Tabs>
  </div>
</template>

<script lang="ts" setup>
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CompareData } from "@/model/comparedata/CompareData";
import { ref } from "vue";
import CompareDataResultMobileGroup from "./CompareDataResultMobileGroup.vue";

defineProps<{
  compareDatasMatching?: CompareData[];
  compareDatasMatchingCountClass: string;
  compareDatasWrongCapitalsource?: CompareData[];
  compareDatasWrongCapitalsourceCountClass: string;
  compareDatasNotInFile?: CompareData[];
  compareDatasNotInFileCountClass: string;
  compareDatasNotInDatabase?: CompareData[];
  compareDatasNotInDatabaseCountClass: string;
  capitalsourceId: number;
  capitalsourceComment: string;
}>();
const activeTab = ref("notInDb");
</script>
