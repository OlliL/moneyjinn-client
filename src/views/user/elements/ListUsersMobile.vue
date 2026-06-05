<template>
  <div
    data-testid="user-mobile-accordion"
    class="md:hidden w-full max-w-md mx-auto px-2 mb-6 space-y-3"
  >
    <Accordion type="multiple" class="space-y-2">
      <AccordionItem
        v-for="user in users"
        :key="user.id"
        :value="`item-${user.id}`"
        :data-testid="`user-mobile-row-${user.id}`"
        class="border rounded-lg bg-background shadow-sm px-3 py-1"
      >
        <AccordionTrigger class="hover:no-underline w-full min-w-0">
          <div
            :data-testid="`user-mobile-trigger-${user.id}`"
            class="grid grid-cols-[1fr_auto] items-center w-full gap-2"
          >
            <div class="flex flex-col items-start text-left overflow-hidden">
              <span class="font-bold text-sm truncate w-full">{{
                user.userName
              }}</span>
              <span class="text-xs text-muted-foreground">{{
                user.groupName
              }}</span>
            </div>
            <div class="flex items-center gap-1 pr-2">
              <Button
                variant="ghost"
                size="icon"
                :data-testid="`user-mobile-edit-${user.id}`"
                @click.stop="actions.edit(user)"
              >
                <Pencil class="icon-medium" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                :data-testid="`user-mobile-delete-${user.id}`"
                @click.stop="actions.delete(user)"
              >
                <Trash2 class="icon-medium" />
              </Button>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent class="pt-2">
          <div
            class="grid grid-cols-1 gap-2 text-sm bg-muted/40 p-3 rounded-md"
          >
            <div class="flex justify-between gap-2">
              <span class="text-muted-foreground">{{ $t("User.role") }}</span>
              <span>{{ roleString(user) }}</span>
            </div>
            <div class="flex justify-between gap-2">
              <span class="text-muted-foreground">{{ $t("User.new") }}</span>
              <SpanBoolean :value="user.userIsNew" />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>

<script lang="ts" setup>
import SpanBoolean from "@/components/common/SpanBoolean.vue";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { UserActionsKey } from "@/model/CrudActions";
import type { User } from "@/model/user/User";
import { userRoleNames } from "@/model/user/UserRole";
import { Pencil, Trash2 } from "lucide-vue-next";
import { inject } from "vue";

defineProps<{
  users: User[];
}>();

const actions = inject(UserActionsKey)!;

const roleString = (user: User): string => {
  return userRoleNames[user.role];
};
</script>
