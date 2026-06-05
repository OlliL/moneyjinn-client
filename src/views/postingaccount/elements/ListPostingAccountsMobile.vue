<template>
  <div
    data-testid="posting-account-mobile-accordion"
    class="md:hidden w-full max-w-md mx-auto px-2 mb-6 space-y-3"
  >
    <div
      v-if="postingAccounts.length === 0"
      data-testid="posting-account-empty-mobile"
      class="w-full text-center text-muted-foreground mt-4"
    >
      {{ $t("General.noEntries") }}
    </div>

    <div v-else class="space-y-2">
      <Card
        v-for="mpa in postingAccounts"
        :key="mpa.id"
        :data-testid="`posting-account-mobile-row-${mpa.id}`"
        class="shadow-sm"
      >
        <CardContent class="grid grid-cols-[1fr_auto] items-center gap-2">
          <div class="flex flex-col items-start text-left overflow-hidden">
            <span class="font-bold text-sm truncate w-full">
              {{ mpa.name }}
            </span>
          </div>
          <div class="flex items-center gap-1 pr-2">
            <Button
              variant="ghost"
              size="icon"
              :data-testid="`posting-account-mobile-edit-${mpa.id}`"
              @click="actions.edit(mpa)"
            >
              <Pencil class="icon-medium" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              :data-testid="`posting-account-mobile-delete-${mpa.id}`"
              @click="actions.delete(mpa)"
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
import { PostingAccountActionsKey } from "@/model/CrudActions";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import { Pencil, Trash2 } from "lucide-vue-next";
import { inject } from "vue";

defineProps<{
  postingAccounts: PostingAccount[];
}>();

const actions = inject(PostingAccountActionsKey)!;
</script>
