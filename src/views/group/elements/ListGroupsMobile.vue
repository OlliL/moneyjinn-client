<template>
  <div
    data-testid="group-mobile-accordion"
    class="md:hidden w-full max-w-md mx-auto px-2 mb-6 space-y-3"
  >
    <div
      v-if="groups.length === 0"
      data-testid="group-empty-mobile"
      class="w-full text-center text-muted-foreground mt-4"
    >
      {{ $t("General.noEntries") }}
    </div>

    <div v-else class="space-y-2">
      <Card
        v-for="group in groups"
        :key="group.id"
        :data-testid="`group-mobile-row-${group.id}`"
        class="shadow-sm"
      >
        <CardContent class="grid grid-cols-[1fr_auto] items-center gap-2">
          <div class="flex flex-col items-start text-left overflow-hidden">
            <span class="font-bold text-sm truncate w-full">
              {{ group.name }}
            </span>
          </div>
          <div class="flex items-center gap-1 pr-2">
            <Button
              variant="ghost"
              size="icon"
              :data-testid="`group-mobile-edit-${group.id}`"
              @click="editGroup(group)"
            >
              <Pencil class="icon-medium" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              :data-testid="`group-mobile-delete-${group.id}`"
              @click="deleteGroup(group)"
            >
              <Trash2 class="icon-medium" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Group } from "@/model/group/Group";
import { Pencil, Trash2 } from "lucide-vue-next";
import type { PropType } from "vue";

defineProps<{
    groups: Group[];
}>();

const emit = defineEmits(["deleteGroup", "editGroup"]);

const deleteGroup = (group: Group) => {
  emit("deleteGroup", group);
};

const editGroup = (group: Group) => {
  emit("editGroup", group);
};
</script>
