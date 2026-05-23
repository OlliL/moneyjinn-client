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
    <Accordion v-else type="multiple" class="space-y-2">
      <AccordionItem
        v-for="group in groups"
        :key="group.id"
        :value="`item-${group.id}`"
        :data-testid="`group-mobile-row-${group.id}`"
        class="border rounded-lg bg-background shadow-sm px-3 py-2"
      >
        <AccordionTrigger
          :data-testid="`group-mobile-trigger-${group.id}`"
          class="hover:no-underline"
        >
          <div class="flex items-center justify-between w-full gap-2">
            <span class="font-bold text-sm truncate">{{ group.name }}</span>
            <div class="flex items-center gap-1 pr-2">
              <Button
                variant="ghost"
                size="icon"
                :data-testid="`group-mobile-edit-${group.id}`"
                @click.stop="editGroup(group)"
              >
                <Pencil class="icon-small" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                :data-testid="`group-mobile-delete-${group.id}`"
                @click.stop="deleteGroup(group)"
              >
                <Trash2 class="icon-small" />
              </Button>
            </div>
          </div>
        </AccordionTrigger>
      </AccordionItem>
    </Accordion>
  </div>
</template>

<script lang="ts" setup>
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { Group } from "@/model/group/Group";
import { Pencil, Trash2 } from "lucide-vue-next";
import type { PropType } from "vue";

defineProps({
  groups: {
    type: Array as PropType<Group[]>,
    required: true,
  },
});

const emit = defineEmits(["deleteGroup", "editGroup"]);

const deleteGroup = (group: Group) => {
  emit("deleteGroup", group);
};

const editGroup = (group: Group) => {
  emit("editGroup", group);
};
</script>
